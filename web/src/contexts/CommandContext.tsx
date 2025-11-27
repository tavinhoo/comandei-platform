import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Command } from '../types/command';
import { commandService } from '../services/commandService';
import { useAuth } from './AuthContext';

interface CommandContextData {
    commands: Command[];
    dashboardCommands: Command[];
    loading: boolean;
    refreshCommands: () => Promise<void>;
    refreshDashboard: () => Promise<void>;
    updateCommand: (command: Command) => void;
}

const CommandContext = createContext<CommandContextData>({} as CommandContextData);

export const CommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [commands, setCommands] = useState<Command[]>([]);
    const [dashboardCommands, setDashboardCommands] = useState<Command[]>([]);
    const [loading, setLoading] = useState(true);
    const { signed } = useAuth();

    const refreshCommands = useCallback(async () => {
        try {
            const data = await commandService.getCommands();
            setCommands(data);
        } catch (error) {
            console.error('Failed to load commands:', error);
        }
    }, []);

    const refreshDashboard = useCallback(async () => {
        try {
            const data = await commandService.getDashboardCommands();
            setDashboardCommands(data);
        } catch (error) {
            console.error('Failed to load dashboard commands:', error);
        }
    }, []);

    const loadAllData = useCallback(async () => {
        if (!signed) return;

        setLoading(true);
        try {
            await Promise.all([refreshCommands(), refreshDashboard()]);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    }, [signed, refreshCommands, refreshDashboard]);

    useEffect(() => {
        if (signed) {
            loadAllData();
        }
    }, [signed, loadAllData]);

    const updateCommand = useCallback((updatedCommand: Command) => {
        setCommands(prev => prev.map(c => c.id === updatedCommand.id ? updatedCommand : c));
        setDashboardCommands(prev => prev.map(c => c.id === updatedCommand.id ? updatedCommand : c));
    }, []);

    return (
        <CommandContext.Provider value={{
            commands,
            dashboardCommands,
            loading,
            refreshCommands,
            refreshDashboard,
            updateCommand
        }}>
            {children}
        </CommandContext.Provider>
    );
};

export const useCommands = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error('useCommands must be used within a CommandProvider');
    }
    return context;
};

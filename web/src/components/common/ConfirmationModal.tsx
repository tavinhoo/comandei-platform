import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) => {
    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="confirmation-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirmation-body">
                    <p>{message}</p>
                </div>
                <div className="confirmation-footer">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        {cancelText}
                    </button>
                    <button type="button" className="btn-confirm" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

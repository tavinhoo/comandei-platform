import axios, { type AxiosError } from 'axios'
import { toast } from 'sonner'
import type { ApiErrorResponse } from './types'

const client = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Extrai a mensagem de erro do backend (ErrorResponse.java)
 * a partir de um AxiosError, com fallback para mensagem genérica.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
    const axiosErr = error as AxiosError<ApiErrorResponse>
    return axiosErr?.response?.data?.message || fallback
}

client.interceptors.response.use(
    (res) => res,
    (error: AxiosError<ApiErrorResponse>) => {
        const status = error.response?.status
        const backendMessage = error.response?.data?.message

        switch (status) {
            case 400:
                toast.error(backendMessage || 'Requisição inválida.')
                break
            case 401:
                // Se o erro veio do login, exibir mensagem de credenciais
                if (error.config?.url?.includes('/auth/login')) {
                    toast.error(backendMessage || 'E-mail ou senha inválidos.')
                } else {
                    toast.error('Sessão expirada. Faça login novamente.')
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                break
            case 403:
                toast.error(backendMessage || 'Acesso negado. Permissão insuficiente.')
                break
            case 404:
                toast.error(backendMessage || 'Recurso não encontrado.')
                break
            case 409:
                toast.error(backendMessage || 'Conflito: o recurso já existe ou está em uso.')
                break
            case 500:
                toast.error('Erro interno do servidor. Tente novamente mais tarde.')
                break
            default:
                if (status && status >= 400) {
                    toast.error(backendMessage || 'Ocorreu um erro inesperado.')
                }
        }

        return Promise.reject(error)
    }
)

export default client

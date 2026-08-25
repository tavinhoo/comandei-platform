/**
 * Comandei Platform – API Contract Types
 * =======================================
 * Contrato centralizado de tipos TypeScript que espelha
 * os DTOs e respostas do backend Spring Boot.
 *
 * Equivalente a um client SDK gerado via OpenAPI / Swagger.
 * Qualquer alteração nos DTOs do backend deve ser refletida aqui.
 */

// ─── Enums ──────────────────────────────────────────────

export type CommandStatus = 'OPEN' | 'CLOSED' | 'CANCELED'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED'

export type Role = 'EMPLOYEE' | 'MANAGER'

// ─── Error Response (espelha ErrorResponse.java) ────────

export interface ApiErrorResponse {
    /** ISO timestamp, ex: "2026-08-21T20:30:00" */
    timestamp: string
    /** HTTP status code (400, 401, 403, 404, 409, 500) */
    status: number
    /** Mensagem legível descrevendo o erro */
    message: string
    /** Caminho da requisição que originou o erro, ex: "/api/comandas" */
    path: string
}

// ─── Auth ───────────────────────────────────────────────

export interface AuthRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
}

// ─── Users ──────────────────────────────────────────────

export interface UserSummary {
    id: number
    name: string
    email: string
    role: Role
}

export interface UserRequest {
    name: string
    email: string
    password: string
    role: Role
}

// ─── Menu Items ─────────────────────────────────────────

export interface MenuItem {
    id: number
    name: string
    description: string | null
    price: number
    isActive: boolean
}

export interface MenuItemRequest {
    name: string
    description?: string
    price: number
    isActive?: boolean
}

// ─── Commands ───────────────────────────────────────────

export interface CommandDto {
    id: number
    tableNumber: number
    customerName: string | null
    status: CommandStatus
    totalValue: number
    openTime: string
    closeTime: string | null
    responsibleEmployeeId: number | null
    responsibleEmployeeName: string | null
}

export interface CommandRequest {
    tableNumber: number
    customerName?: string
}

export interface OrderRequest {
    menuItemId: number
    quantity: number
}

// ─── Command Detail (espelha CommandDetailDto.java) ─────

export interface EmployeeInfo {
    id: number
    name: string
}

export interface MenuItemInfo {
    id: number
    name: string
    price: number
}

export interface OrderInfo {
    id: number
    quantity: number
    status: OrderStatus
    orderTime: string
    menuItem: MenuItemInfo | null
}

export interface CommandDetail {
    id: number
    tableNumber: number
    customerName: string | null
    status: CommandStatus
    totalValue: number
    openTime: string
    closeTime: string | null
    responsibleEmployee: EmployeeInfo | null
    orders: OrderInfo[]
}

// ─── Reports ────────────────────────────────────────────

/** Revenue endpoint retorna apenas um número decimal (BigDecimal) */
export type RevenueResponse = number

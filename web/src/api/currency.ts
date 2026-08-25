const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export const fmtBRL = (value: number): string => currencyFormatter.format(value)

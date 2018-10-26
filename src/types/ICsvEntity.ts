// TODO: currency should always be int not float!
export interface ICsvEntity {
    accountNumber?: string,
    amount?: number,
    amountForeign?: number,
    category?: string,
    date: Date,
    exchangeRate?: number,
    payee?: string,
    paymentReference?: string,
    transactionType?: string,
    typeForeign?: string,
}
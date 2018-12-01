import {Money} from "./Money";

export interface ICsvEntity {
    accountNumber?: string,
    amount: Money,

    // Since Money class only supports one currency type it does not make sense
    // To have foreign amount be of type Money aswell. Change ASAP
    amountForeign?: number,
    category?: string,
    date: Date,
    exchangeRate?: number,
    payee?: string,
    paymentReference?: string,
    transactionType?: string,
    typeForeign?: string,
}
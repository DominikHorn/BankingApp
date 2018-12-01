import {Money} from "./Money";

export interface ICsvEntity {
    // Key is needed for unique identification of an Entity
    key: string,

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
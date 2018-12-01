import * as React from "react";
import {ICsvEntity} from "../types/ICsvEntity";
import {Money} from "../types/Money";

export const csvColumns = [{
    dataIndex: 'date',
    key: 'date',
    render: (date: Date) => <span>{date.toLocaleDateString()}</span>,
    title: 'Date',
    width: 100,
}, {
    dataIndex: 'payee',
    key: 'payee',
    title: 'Payee',
    width: 150,
}, {
    dataIndex: 'accountNumber',
    key: 'accountNumber',
    title: 'Account Number',
    width: 250,
}, {
    dataIndex: 'transactionType',
    key: 'transactionType',
    title: 'Transaction Type',
    width: 200,
}, {
    dataIndex: 'paymentReference',
    key: 'paymentReference',
    title: 'Payment Reference',
    width: 200,
}, {
    dataIndex: 'category',
    key: 'category',
    title: 'Category',
    width: 150,
}, {
    dataIndex: 'amount',
    key: 'amount',
    render: (mon: Money) => mon.toString(),
    title: 'Amount',
    width: 80,
// }, {
//     dataIndex: 'amountForeign',
//     key: 'amountForeign',
//     title: 'Amount Foreign',
//     width: 120,
// }, {
//     dataIndex: 'typeForeign',
//     key: 'typeForeign',
//     title: 'Type Foreign',
//     width: 100,
// }, {
//     dataIndex: 'exchangeRate',
//     key: 'exchangeRate',
//     title: 'Exchange Rate',
//     width: 120,
}];

export function parseN26Csv(fileContents: string): ICsvEntity[] {
    const lines = fileContents.split(/\r?\n/);
    if (lines.length === 0) {
        return [];
    }
    // This is currently ignored
    const columnTitles = csvLineToFields(lines[0]);
    const result: ICsvEntity[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (line && line !== "") {
            result.push(parseN26CsvLine(columnTitles, line));
        }
    }
    return result;
}

function csvLineToFields(csvLine: string): string[] {
    return csvLine
        .substr(1, csvLine.length-2)
        .split(/","/);
}

function getField(fieldName: string, fields: string[], fieldMap: string[]): string | undefined {
    const fieldIndex = fieldMap.indexOf(fieldName);
    if (fields.length <= fieldIndex) {
        return undefined;
    }
    return fields[fieldIndex];
}

function parseN26CsvLine(columnTitles: string[], line: string): ICsvEntity {
    const fields = csvLineToFields(line);
    const accountNumber = getField("Account number", fields, columnTitles);
    const amount = getField("Amount (EUR)", fields, columnTitles);
    const amountForeign = getField("Amount (Foreign Currency)", fields, columnTitles);
    const category = getField("Category", fields, columnTitles);
    const date = getField("Date", fields, columnTitles);
    const exchangeRate = getField("Exchange Rate", fields, columnTitles);
    const payee = getField("Payee", fields, columnTitles);
    const paymentReference = getField("Payment reference", fields, columnTitles);
    const transactionType = getField("Transaction type", fields, columnTitles);
    const typeForeign = getField("Type Foreign Currency", fields, columnTitles);
    return {
        accountNumber,
        amount: amount && amount !== "" ? Money.parse(amount) : new Money(),
        amountForeign: amountForeign && amountForeign !== "" ? parseFloat(amountForeign) : undefined,
        category,
        date: date ? new Date(date) : new Date(), // TODO: rework this line
        exchangeRate: exchangeRate && exchangeRate !== "" ? parseFloat(exchangeRate) : undefined,
        payee,
        paymentReference,
        transactionType,
        typeForeign,
    };
}
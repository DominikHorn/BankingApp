// TODO: Support different currencies and autoconversions
export class Money {
    public static add(mon1: Money, mon2: Money): Money {
        const newMon = new Money();
        newMon.amount = mon1.amount + mon2.amount;
        return newMon;
    }

    public static parse(repr: string): Money {
        // Filter with regex to make sure this is a valid money string
        const matches = repr.match(/-?[0-9]*\.([0-9][0-9]|[0-9])/);
        if (!matches) {
            throw new Error(`Invalid Argument in Money.constructor(). repr string: '${repr}'`);
        }

        // Money object
        const result = new Money();

        // Regex match. Make sure it always contains 2 digits after decimal '.'
        // To achieve this, append 0 if required
        const amountStr = matches[0] + (matches[1].length < 2 ? '0' : '');
        const amountParts = amountStr.split('.');

        // Remove decimal dot and store as integer
        result.amount = parseInt(`${amountParts[0]}${amountParts[1]}`, 10);

        return result;
    }

    private amount: number;
    constructor(amount: number = 0) {
        this.amount = amount;
    }

    public value(): number {
        return this.amount / 100.0;
    }

    public valueString(): string {
        const amountStr = this.amount.toString();
        return `${amountStr.substr(0, amountStr.length - 2)}.${amountStr.substr(amountStr.length - 2, 2)}`;
    }

    public toString(): string {
        return `${this.valueString()}€`;
    }
}
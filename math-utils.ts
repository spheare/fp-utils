/** @format */

export function round(value: number, fractionalDigits = 2) {
    return Math.round(value * 10 ** fractionalDigits) / 10 ** fractionalDigits;
}

export function padNumber(value: number, padFractionalDigits = 2) {
    const [int, fracts = ''] = `${value}`.split('.');
    return `${int}.${fracts.padEnd(padFractionalDigits, '0')}`;
}

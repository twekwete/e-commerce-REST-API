export const amountToCents = (Amount) => {
    return parseInt(parseFloat(Amount) * 100, 10);
}
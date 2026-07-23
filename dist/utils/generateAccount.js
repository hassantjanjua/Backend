"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiry = exports.generateCardNumber = exports.generateAccountNumber = void 0;
const generateAccountNumber = () => {
    const group = () => Math.floor(1000 + Math.random() * 9000);
    return `${group()} ${group()} ${group()}`;
};
exports.generateAccountNumber = generateAccountNumber;
const generateCardNumber = () => {
    const group = () => Math.floor(1000 + Math.random() * 9000);
    return `${group()} ${group()} ${group()} ${group()}`;
};
exports.generateCardNumber = generateCardNumber;
const generateExpiry = (yearsFromNow = 4) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String((now.getFullYear() + yearsFromNow) % 100).padStart(2, "0");
    return `${month}/${year}`;
};
exports.generateExpiry = generateExpiry;

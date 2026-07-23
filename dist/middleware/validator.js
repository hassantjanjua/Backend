"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, res, next) => {
        const errors = [];
        for (const [field, rule] of Object.entries(schema)) {
            const value = req.body?.[field];
            if (rule.required &&
                (value === undefined || value === null || value === "")) {
                errors.push(`${field} is required`);
                continue;
            }
            if (value !== undefined && rule.type && typeof value !== rule.type) {
                errors.push(`${field} must be of type ${rule.type}`);
            }
            if (typeof value === "string" &&
                rule.minLength &&
                value.length < rule.minLength) {
                errors.push(`${field} must be at least ${rule.minLength} characters`);
            }
        }
        if (errors.length > 0) {
            return res
                .status(400)
                .json({ error: "Validation failed", details: errors });
        }
        next();
    };
};
exports.validateBody = validateBody;

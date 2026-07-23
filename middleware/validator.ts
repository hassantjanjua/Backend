import { NextFunction, Request, Response } from "express";

type FieldRule = {
  required?: boolean;
  type?: "string" | "number" | "boolean";
  minLength?: number;
};

export type ValidationSchema = Record<string, FieldRule>;

export const validateBody = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const [field, rule] of Object.entries(schema)) {
      const value = req.body?.[field];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && rule.type && typeof value !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }

      if (
        typeof value === "string" &&
        rule.minLength &&
        value.length < rule.minLength
      ) {
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

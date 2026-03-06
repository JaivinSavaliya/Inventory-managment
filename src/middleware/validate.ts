import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

/**
 * Middleware factory that validates req.body against a DTO class.
 * Uses class-transformer to instantiate the DTO and class-validator to check constraints.
 * On failure, returns 400 with a list of validation error messages.
 */
export function validateBody(dtoClass: any) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw if unknown properties are sent
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => {
          const constraints = error.constraints;
          return constraints ? Object.values(constraints).join(", ") : "";
        })
        .filter((msg) => msg.length > 0);

      _res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
      return;
    }

    // Replace body with the validated DTO instance (stripped & typed)
    req.body = dtoInstance;
    next();
  };
}

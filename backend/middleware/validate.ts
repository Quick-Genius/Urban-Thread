import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as { body?: unknown; query?: unknown; params?: unknown };

    if (result.body !== undefined) req.body = result.body;
    if (result.query !== undefined) req.query = result.query as typeof req.query;
    if (result.params !== undefined) req.params = result.params as typeof req.params;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({
        field: e.path.slice(1).join('.'),
        message: e.message,
      }));

      res.status(400).json({
        success: false,
        message: errors[0]?.message || 'Validation failed',
        errors,
      });
      return;
    }
    next(err);
  }
};

export default validate;

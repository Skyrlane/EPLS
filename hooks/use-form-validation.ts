import { useState } from "react";
import { z } from "zod";

export type ValidationError = {
  path: string;
  message: string;
};

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = (data: unknown): data is z.infer<T> => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const formattedErrors = result.error.errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
      }));
      
      setErrors(formattedErrors);
      return false;
    }
    
    setErrors([]);
    return true;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find((err) => err.path === fieldName);
    return error?.message;
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return {
    errors,
    validate,
    getFieldError,
    clearErrors,
  };
} 
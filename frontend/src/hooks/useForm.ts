// src/hooks/useForm.ts
import { useState, useCallback } from 'react';
import * as yup from 'yup';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: yup.ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
        // Clear error when value changes
        errors: {
          ...prev.errors,
          [name]: undefined,
        },
      }));
    },
    []
  );

  // Handle select change
  const handleSelectChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
      // Clear error when value changes
      errors: {
        ...prev.errors,
        [name]: undefined,
      },
    }));
  }, []);

  // Set a single value
  const setValue = useCallback((name: keyof T, value: any) => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));
  }, []);

  // Handle field blur for individual field validation
  const handleBlur = useCallback(
    async (fieldName: keyof T) => {
      // Mark field as touched
      setFormState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [fieldName]: true,
        },
      }));

      // Skip validation if no schema provided
      if (!validationSchema) return;

      try {
        // Create a schema just for this field
        const fieldSchema = yup.object({
          [fieldName]: validationSchema.fields[fieldName as string],
        });

        // Validate just this field
        await fieldSchema.validate(
          { [fieldName]: formState.values[fieldName] },
          { abortEarly: false }
        );

        // Clear error for this field if validation passes
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [fieldName]: undefined,
          },
        }));
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          // Set error for this field
          const fieldError = error.inner.find(
            (err) => err.path === fieldName.toString()
          );
          if (fieldError) {
            setFormState((prev) => ({
              ...prev,
              errors: {
                ...prev.errors,
                [fieldName]: fieldError.message,
              },
            }));
          }
        }
      }
    },
    [validationSchema, formState.values]
  );

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(formState.values, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Partial<Record<keyof T, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof T] = err.message;
          }
        });

        setFormState((prev) => ({
          ...prev,
          errors,
        }));
      }
      return false;
    }
  }, [validationSchema, formState.values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(formState.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      );

      setFormState((prev) => ({
        ...prev,
        touched: allTouched,
        isSubmitting: true,
      }));

      // Validate form
      const isValid = await validateForm();
      if (!isValid) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
        return;
      }

      try {
        // Call onSubmit callback
        await onSubmit(formState.values);
      } catch (error) {
        // Handle API errors if needed
        console.error('Form submission error:', error);

        // If the error contains field-specific errors, set them
        if ((error as any)?.apiError?.errors) {
          setFormState((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              ...(error as any).apiError.errors,
            },
          }));
        }
      } finally {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
      }
    },
    [formState.values, validateForm, onSubmit]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  // Set form errors manually (e.g., from API responses)
  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        ...errors,
      },
    }));
  }, []);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    handleChange,
    handleSelectChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
    setValue,
  };
}

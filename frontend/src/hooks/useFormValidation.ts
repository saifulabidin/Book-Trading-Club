import { useState, ChangeEvent, FormEvent } from 'react';

export interface FormValidationOptions<T extends Record<string, any>> {
  initialValues: T;
  validate: (values: T) => Record<string, string>;
  onSubmit: (values: T) => Promise<void> | void;
}

export default function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: FormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    let processedValue: any = value;

    // Handle special input types
    if (type === 'checkbox') {
      processedValue = (event.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      // Store as string, convert to number when submitting if needed
      processedValue = value;
    }

    setValues({
      ...values,
      [name]: processedValue
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
}

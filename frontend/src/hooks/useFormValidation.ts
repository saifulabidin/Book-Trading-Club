import { useState, useEffect, useCallback } from 'react';

type ValidationFunction = (values: any) => Record<string, string>;

interface UseFormValidationProps {
  initialValues: Record<string, any>;
  validate: ValidationFunction;
  onSubmit: (values: any) => Promise<void>;
}

export const useFormValidation = ({
  initialValues,
  validate,
  onSubmit
}: UseFormValidationProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateField = useCallback((name: string, value: any) => {
    const fieldError = validate({ [name]: value });
    return fieldError[name];
  }, [validate]);

  useEffect(() => {
    const validateForm = () => {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    };

    if (isSubmitting) {
      const isValid = validateForm();
      if (isValid) {
        onSubmit(values)
          .then(() => {
            setValues(initialValues);
            setTouched({});
          })
          .catch(error => {
            console.error('Form submission error:', error);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, validate, values, onSubmit, initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useFormValidation;

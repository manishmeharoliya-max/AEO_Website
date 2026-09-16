import { useState } from 'react';
import { validateInquiry } from '../utils/validateInquiry.js';
import { api } from '../../../lib/api.js';
export function useInquiryForm(fields, initialValues = {}, type = 'contact') {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const validationErrors = validateInquiry(fields, values);
    setErrors(validationErrors);
    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField) {
      event.currentTarget.elements.namedItem(firstInvalidField)?.focus();
      return;
    }

    setBusy(true);
    setSubmitError('');
    try {
      const result = await api('/inquiries', { method: 'POST', body: { type, details: values } });
      setSubmission(result);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setBusy(false);
    }
  }
  function resetForm() {
    setSubmission(null);
    setValues({});
    setErrors({});
    setSubmitError('');
  }
  return {
    values,
    errors,
    submission,
    busy,
    submitError,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

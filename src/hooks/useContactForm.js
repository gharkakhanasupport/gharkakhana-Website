import { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const endpoint = 'https://script.google.com/macros/s/AKfycbyaoiVMgMq9Ph5mMQe_DBOboz1zmUB9412VKdbgzeCKZEO7eqNrteCNqlfOTRMwyES7pQ/exec';

const initialState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Full name is required.';
  if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.subject) errors.subject = 'Select a subject.';
  if (!values.message.trim()) errors.message = 'Message is required.';

  return errors;
}
export function useContactForm() {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const { demoMode } = useSiteSettings();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    setStatus('loading');

    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setValues(initialState);
      return true;
    }

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      setStatus('success');
      setValues(initialState);
      return true;
    } catch (error) {
      setStatus('error');
      return false;
    }
  }

  return {
    values,
    errors,
    status,
    handleChange,
    handleSubmit,
    resetStatus: () => setStatus('idle'),
  };
}

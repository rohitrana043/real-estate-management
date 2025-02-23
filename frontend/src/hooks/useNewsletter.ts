// src/hooks/useNewsletter.ts
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { validateEmail } from '@/lib/validation/newsletter';
import newsletterApi from '@/lib/api/newsletter';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';

interface UseNewsletterReturn {
  email: string;
  emailError: string;
  loading: boolean;
  success: boolean;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useNewsletter(): UseNewsletterReturn {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { language } = useSettings();
  const t = translations[language];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || 'Invalid email');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      await newsletterApi.subscribe(email);

      setSuccess(true);
      setEmail('');
      enqueueSnackbar(t.newsletter.successMessage, { variant: 'success' });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);

      if (error.apiError?.errors?.email) {
        setEmailError(error.apiError.errors.email);
      }

      enqueueSnackbar(error.apiError?.message || t.newsletter.errorMessage, {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setEmailError('');
    setSuccess(false);
  };

  return {
    email,
    emailError,
    loading,
    success,
    handleEmailChange,
    handleSubmit,
    resetForm,
  };
}

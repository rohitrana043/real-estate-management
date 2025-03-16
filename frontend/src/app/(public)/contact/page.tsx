// src/app/(public)/contact/page.tsx
'use client';

import GoogleMap from '@/components/maps/GoogleMap';
import { useSettings } from '@/contexts/SettingsContext';
import { useForm } from '@/hooks/useForm';
import contactApi, { ContactFormData } from '@/lib/api/contact';
import { contactFormSchema } from '@/lib/validation/contact';
import { translations } from '@/translations';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export default function ContactPage() {
  const { language } = useSettings();
  const t = translations[language];
  const { enqueueSnackbar } = useSnackbar();
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initial form state
  const initialValues: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
  };

  // Form submission handler
  const handleFormSubmit = async (values: ContactFormData) => {
    try {
      const response = await contactApi.submitContactForm(values);

      // Show success message
      setFormSuccess(true);
      setFormError(null);
      enqueueSnackbar('Your message has been sent successfully!', {
        variant: 'success',
      });

      // Reset form
      resetForm();

      return response;
    } catch (error) {
      console.error('Error submitting contact form:', error);

      // Extract error message
      let errorMessage =
        'There was an error sending your message. Please try again later.';

      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || errorMessage;

        // If there are field-specific errors, they will be handled by the form hook
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }

      setFormError(errorMessage);
      setFormSuccess(false);
      enqueueSnackbar(errorMessage, { variant: 'error' });

      throw error;
    }
  };

  // Initialize form with hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
  } = useForm({
    initialValues,
    validationSchema: contactFormSchema,
    onSubmit: handleFormSubmit,
  });

  const officeAddress =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_ADDRESS ||
    '100 Parkway Forest Dr, North York, ON M2J 1L6';

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      officeAddress
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon fontSize="large" color="primary" />,
      title: 'Our Location',
      details: ['North York, M2J 1L6', 'Canada'],
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone Numbers',
      details: ['Main Office: +1 (905) 352-9059'],
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email Addresses',
      details: ['connect@rohitrana.dev', 'rohit.rana043@gmail.com'],
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'Business Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 10:00 AM - 4:00 PM',
        'Sunday: Closed',
      ],
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          position: 'relative',
          pt: 8,
          pb: 12,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/contact-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Contact Us
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              We're Here to Help You with All Your Real Estate Needs
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Information Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{info.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form & Map Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Get in Touch
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Fill out the form below, and our team will get back to you
                  within 24 hours.
                </Typography>

                {/* Success message */}
                {formSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your message! We'll get back to you within 24
                    hours.
                  </Alert>
                )}

                {/* Error message */}
                {formError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        error={touched.phone && !!errors.phone}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        error={touched.inquiryType && !!errors.inquiryType}
                      >
                        <InputLabel>Inquiry Type</InputLabel>
                        <Select
                          value={values.inquiryType}
                          label="Inquiry Type"
                          name="inquiryType"
                          onChange={handleSelectChange}
                          onBlur={() => handleBlur('inquiryType')}
                        >
                          <MenuItem value="GENERAL">General Inquiry</MenuItem>
                          <MenuItem value="BUYING">Buying Property</MenuItem>
                          <MenuItem value="SELLING">Selling Property</MenuItem>
                          <MenuItem value="RENTING">Renting Property</MenuItem>
                          <MenuItem value="INVESTMENT">
                            Investment Opportunity
                          </MenuItem>
                        </Select>
                        {touched.inquiryType && errors.inquiryType && (
                          <FormHelperText>{errors.inquiryType}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={() => handleBlur('subject')}
                        error={touched.subject && !!errors.subject}
                        helperText={touched.subject && errors.subject}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={values.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        error={touched.message && !!errors.message}
                        helperText={touched.message && errors.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Map & Office Info */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 0,
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                {/* Google Map */}
                <GoogleMap address={officeAddress} zoom={15} height={350} />

                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Visit Our Office
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Our main office is conveniently located in the heart of
                    downtown, with easy access to public transportation and
                    plenty of parking options nearby.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    We invite you to stop by during our business hours to meet
                    our team and discuss your real estate needs in person. No
                    appointment necessary, but scheduling ahead ensures that the
                    right specialist is available to assist you.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleGetDirections}
                  >
                    Get Directions
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Find quick answers to common inquiries about our services
        </Typography>

        {[
          {
            question: 'What areas do you serve?',
            answer:
              'We primarily serve the metropolitan area and surrounding suburbs, covering a radius of approximately 50 miles from our main office.',
          },
          {
            question: 'How quickly can I expect a response?',
            answer:
              'We respond to all inquiries within 24 hours during business days. For urgent matters, we recommend calling our office directly.',
          },
          {
            question: 'Do you offer virtual consultations?',
            answer:
              'Yes, we offer virtual consultations via video call for clients who cannot visit our office in person. These can be scheduled through our online booking system.',
          },
          {
            question:
              'What information should I prepare before contacting you about selling my property?',
            answer: `It's helpful to have basic information about your property (size, location, features), any recent renovations, your timeline for selling, and your approximate asking price.`,
          },
        ].map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

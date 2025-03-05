'use client';

import { Home as HomeIcon } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';

export default function PrivacyPolicyPage() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">Privacy Policy</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Privacy Policy
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ '& > section': { mb: 4 } }}>
          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              1. Introduction
            </Typography>
            <Typography paragraph>
              Welcome to [Your Real Estate Website Name]. We respect your
              privacy and are committed to protecting your personal data. This
              privacy policy explains how we collect, use, and safeguard your
              information when you use our website and services.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              2. Information We Collect
            </Typography>
            <Typography paragraph>
              We collect information that you provide directly to us, including:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Personal identification information (name, email address, phone
                number)
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Account credentials (username and password)
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Property preferences and search history
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Communication records between you and our team
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              3. How We Use Your Information
            </Typography>
            <Typography paragraph>
              We use the collected information for:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Providing and improving our services
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Communicating with you about properties and services
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Personalizing your experience on our platform
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Processing transactions and inquiries
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              4. Information Sharing and Disclosure
            </Typography>
            <Typography paragraph>
              We do not sell or rent your personal information to third parties.
              We may share your information with:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Property owners or agents when you express interest in a
                property
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Service providers who assist in our operations
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Legal authorities when required by law
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              5. Security
            </Typography>
            <Typography paragraph>
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the Internet is 100% secure.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              6. Cookies and Tracking
            </Typography>
            <Typography paragraph>
              We use cookies and similar tracking technologies to enhance your
              browsing experience and analyze website traffic. You can control
              cookie settings through your browser preferences.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              7. Your Rights
            </Typography>
            <Typography paragraph>You have the right to:</Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Access your personal data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Correct inaccurate data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Request deletion of your data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Object to data processing
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              8. Changes to This Policy
            </Typography>
            <Typography paragraph>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              9. Contact Us
            </Typography>
            <Typography paragraph>
              If you have any questions about this privacy policy, please
              contact us at:
            </Typography>
            <Typography paragraph>
              Email: connect@rohitrana.dev
              <br />
              Phone: (905) 325-9059
              <br />
              Address: North York, ON M2J 1L6
            </Typography>
          </section>
        </Box>
      </Paper>
    </Container>
  );
}

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

export default function TermsOfServicePage() {
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
        <Typography color="text.primary">Terms of Service</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Terms of Service
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ '& > section': { mb: 4 } }}>
          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              1. Agreement to Terms
            </Typography>
            <Typography paragraph>
              By accessing and using [Your Real Estate Website Name], you agree
              to be bound by these Terms of Service. If you disagree with any
              part of these terms, you may not access our website or use our
              services.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              2. User Accounts
            </Typography>
            <Typography paragraph>
              When you create an account with us, you must provide accurate and
              complete information. You are responsible for maintaining the
              security of your account and password. You agree to notify us
              immediately of any unauthorized access or use of your account.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              3. Property Listings
            </Typography>
            <Typography paragraph>3.1. Information Accuracy</Typography>
            <Typography paragraph>
              While we strive to ensure all property listings are accurate and
              up-to-date, we cannot guarantee the accuracy of all information.
              Property details, prices, and availability are subject to change
              without notice.
            </Typography>

            <Typography paragraph>3.2. Property Images</Typography>
            <Typography paragraph>
              Images of properties are provided for informational purposes only.
              Actual properties may vary from images shown.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              4. User Conduct
            </Typography>
            <Typography paragraph>You agree not to:</Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Use our service for any illegal purposes
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Post false or misleading information
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Harass or interfere with other users
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Attempt to gain unauthorized access to our systems
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              5. Intellectual Property
            </Typography>
            <Typography paragraph>
              The content, features, and functionality of our website are owned
              by [Your Company Name] and are protected by copyright, trademark,
              and other intellectual property laws.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              6. Third-Party Links
            </Typography>
            <Typography paragraph>
              Our website may contain links to third-party websites. We are not
              responsible for the content or practices of these sites and
              encourage you to read their terms and policies.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              7. Limitation of Liability
            </Typography>
            <Typography paragraph>
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use or
              inability to use our services.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              8. Disclaimer of Warranties
            </Typography>
            <Typography paragraph>
              Our services are provided "as is" without any warranty of any
              kind, either express or implied, including but not limited to the
              implied warranties of merchantability and fitness for a particular
              purpose.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              9. Changes to Terms
            </Typography>
            <Typography paragraph>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new terms on
              this site.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              10. Governing Law
            </Typography>
            <Typography paragraph>
              These terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              11. Contact Information
            </Typography>
            <Typography paragraph>
              For any questions regarding these Terms of Service, please contact
              us at:
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

import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'next/navigation';
import { translations } from '@/translations';
import { Box, Typography, Link, Divider, Container } from '@mui/material';

function CommonFooter() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box component="footer" sx={{ mt: 'auto', py: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
          }}
        >
          {/* Copyright on the left */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              order: { xs: 2, md: 1 },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © {new Date().getFullYear()} RealEstate.{' '}
            {t.footer.allRightsReserved}
          </Typography>

          {/* Links on the right */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              alignItems: 'center',
              order: { xs: 1, md: 2 },
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => handleNavigation('/privacy-policy')}
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t.footer.privacy || 'Privacy Policy'}
            </Link>

            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                color: 'text.secondary',
              }}
            >
              •
            </Box>

            <Link
              component="button"
              variant="body2"
              onClick={() => handleNavigation('/terms-of-service')}
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t.footer.terms || 'Terms of Service'}
            </Link>

            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                color: 'text.secondary',
              }}
            >
              •
            </Box>

            <Link
              component="button"
              variant="body2"
              onClick={() => handleNavigation('/newsletter/unsubscribe')}
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t.footer.unsubscribe || 'Unsubscribe'}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CommonFooter;

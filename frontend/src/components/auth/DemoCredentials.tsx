// src/components/auth/DemoCredentials.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  useTheme,
  Tooltip,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoginIcon from '@mui/icons-material/Login';

interface CredentialProps {
  role: string;
  email: string;
  password: string;
  color: string;
  onUseCredentials: (email: string, password: string) => void;
}

const Credential: React.FC<CredentialProps> = ({
  role,
  email,
  password,
  color,
  onUseCredentials,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Box
      sx={{
        flex: isMobile ? '1 1 auto' : '1 1 0',
        p: 1.5,
        borderRadius: 1,
        borderLeft: `3px solid ${color}`,
        m: 0.5,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            backgroundColor: color,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
        >
          {role}
        </Box>
        <Button
          size="small"
          startIcon={<LoginIcon fontSize="small" />}
          onClick={() => onUseCredentials(email, password)}
          color="primary"
          sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}
        >
          Use
        </Button>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: '0.7rem', width: '60px' }}
          >
            Email:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              flex: '1 1 auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '0.75rem',
            }}
          >
            {email}
          </Typography>
          <Tooltip title={copied === 'email' ? 'Copied!' : 'Copy'}>
            <IconButton
              size="small"
              onClick={() => handleCopy(email, 'email')}
              sx={{ ml: 0.5, p: 0.5 }}
            >
              <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: '0.7rem', width: '60px' }}
          >
            Password:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              flex: '1 1 auto',
              fontSize: '0.75rem',
            }}
          >
            {password}
          </Typography>
          <Tooltip title={copied === 'password' ? 'Copied!' : 'Copy'}>
            <IconButton
              size="small"
              onClick={() => handleCopy(password, 'password')}
              sx={{ ml: 0.5, p: 0.5 }}
            >
              <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

interface DemoCredentialsProps {
  onUseCredentials: (email: string, password: string) => void;
  onToggle: (expanded: boolean) => void;
}

export default function DemoCredentials({
  onUseCredentials,
  onToggle,
}: DemoCredentialsProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle(newExpanded);
  };

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleToggle}
        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        fullWidth
        sx={{
          borderStyle: 'dashed',
          borderColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.2)',
          color: 'text.secondary',
          textTransform: 'none',
          py: 0.6,
        }}
      >
        Demo Credentials
      </Button>

      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 1,
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          >
            Select a demo account to explore different roles
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              mx: -0.5,
            }}
          >
            <Credential
              role="Admin"
              email="admin@realestate.com"
              password="Admin123!"
              color="#f44336"
              onUseCredentials={onUseCredentials}
            />
            <Credential
              role="Agent"
              email="agent@realestate.com"
              password="Agent123!"
              color="#2196f3"
              onUseCredentials={onUseCredentials}
            />
            <Credential
              role="Client"
              email="client@realestate.com"
              password="Client123!"
              color="#4caf50"
              onUseCredentials={onUseCredentials}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

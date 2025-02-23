// src/lib/debug/authDebug.ts
'use client';

export function debugAuthState() {
  if (typeof window === 'undefined') {
    console.log('Auth Debug: Running on server side');
    return;
  }

  console.group('🔍 Auth Debug Info');
  console.log('URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);

  // Check localStorage
  console.group('localStorage');
  console.log(
    'token:',
    localStorage.getItem('token') ? '✅ Present' : '❌ Missing'
  );
  console.log(
    'refreshToken:',
    localStorage.getItem('refreshToken') ? '✅ Present' : '❌ Missing'
  );
  console.log(
    'user:',
    localStorage.getItem('user') ? '✅ Present' : '❌ Missing'
  );
  console.log('tokenExpiry:', localStorage.getItem('tokenExpiry'));
  console.groupEnd();

  // Check cookies
  console.group('cookies');
  const cookies = document.cookie.split(';').reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  console.log(
    'auth-token:',
    cookies['auth-token'] ? '✅ Present' : '❌ Missing'
  );
  console.log('All cookies:', cookies);
  console.groupEnd();

  console.groupEnd();
}

// Call this function in your Home component and other key pages
// Example: useEffect(() => { debugAuthState(); }, []);

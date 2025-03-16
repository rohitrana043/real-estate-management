// src/lib/api/mockUtil.ts
import mockResponses from './mockResponses';

export const isMockEnabled = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

/**
 * Utility function to handle API calls with mock data support
 * @param apiCall The actual API call function
 * @param mockPath Path to the mock data in mockResponses (e.g. 'properties.getProperties')
 * @param debugName Name for debugging logs
 * @param requestData Optional request data for endpoints that need dynamic responses
 */
export function withMock<T>(
  apiCall: () => Promise<T>,
  mockPath: string,
  debugName: string,
  requestData?: any
): Promise<T> {
  // If mock mode is enabled, return mock data
  if (isMockEnabled) {
    console.log(`[MOCK] Using mock data for ${debugName}`);

    // Special case for login to handle different credentials
    if (mockPath === 'auth.login' && requestData) {
      return handleMockLogin(requestData);
    }

    // Special case for getCurrentUser to return the current user based on token
    if (mockPath === 'auth.getCurrentUser' && requestData?.getCurrentUserMock) {
      return handleGetCurrentUser();
    }

    // Parse the path to find the mock data
    const [module, endpoint] = mockPath.split('.');
    const mockData = mockResponses[module]?.[endpoint];

    if (mockData !== undefined) {
      return Promise.resolve(mockData as T);
    } else {
      console.warn(`[MOCK] No mock data found for ${mockPath}`);
      return Promise.reject(
        new Error(`No mock data available for ${mockPath}`)
      );
    }
  }

  // Otherwise, make the real API call, but fall back to mock data on error if available
  return apiCall().catch((error) => {
    console.error(`[API] Error in ${debugName}:`, error);

    // Attempt to use mock data as fallback
    if (mockPath === 'auth.login' && requestData) {
      return handleMockLogin(requestData);
    }

    // Regular fallback
    const [module, endpoint] = mockPath.split('.');
    const mockData = mockResponses[module]?.[endpoint];

    if (mockData !== undefined) {
      console.log(`[MOCK] Falling back to mock data on error for ${debugName}`);
      return mockData as T;
    }

    // Re-throw if no fallback is available
    throw error;
  });
}

/**
 * Handle mock login with credentials verification
 */
function handleMockLogin<T>(loginData: any): Promise<T> {
  const { email, password } = loginData;

  // Check if the email exists in our demo users
  const demoUser = mockResponses.auth.demoUsers[email];

  if (demoUser && demoUser.password === password) {
    // Valid credentials - store in localStorage for getCurrentUser to work
    localStorage.setItem('mockUserEmail', email);

    console.log(
      `[MOCK] Successful login for ${email} with role ${demoUser.userData.user.roles[0]}`
    );
    return Promise.resolve(demoUser.userData as T);
  } else {
    // Invalid credentials
    console.log(`[MOCK] Failed login attempt for ${email}`);
    const error = new Error('Invalid email or password');
    (error as any).response = {
      status: 401,
      data: { message: 'Invalid email or password' },
    };
    return Promise.reject(error);
  }
}

/**
 * Handle getting the current user based on stored email
 */
function handleGetCurrentUser<T>(): Promise<T> {
  // Get the stored email from login
  const email = localStorage.getItem('mockUserEmail');

  if (email && mockResponses.auth.demoUsers[email]) {
    // Return the user object
    return Promise.resolve(
      mockResponses.auth.demoUsers[email].userData.user as T
    );
  } else {
    // No stored user or invalid user
    const error = new Error('Not authenticated');
    (error as any).response = {
      status: 401,
      data: { message: 'Not authenticated' },
    };
    return Promise.reject(error);
  }
}

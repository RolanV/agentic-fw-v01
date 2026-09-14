/**
 * Login Test Data Fixtures
 * Contains test data for login scenarios
 */

export interface LoginCredentials {
  email: string;
  password: string;
  description: string;
}

export interface LoginTestCase {
  credentials: LoginCredentials;
  expectedResult: 'success' | 'error' | 'validation_error';
  errorType?:
    | 'invalid_credentials'
    | 'email_required'
    | 'password_required'
    | 'invalid_email_format'
    | 'user_not_found';
}

/**
 * Valid test credentials for student user
 */
export const VALID_STUDENT_CREDENTIALS: LoginCredentials = {
  email: 'student01@zinc.test',
  password: '9pJolA7GBQec',
  description: 'Valid student user credentials',
};

/**
 * Collection of login test cases
 */
export const LOGIN_TEST_CASES: LoginTestCase[] = [
  {
    credentials: {
      email: 'student01@zinc.test',
      password: '9pJolA7GBQec',
      description: 'Valid credentials - Student user',
    },
    expectedResult: 'success',
  },
  {
    credentials: {
      email: '',
      password: '9pJolA7GBQec',
      description: 'Missing email - Password provided',
    },
    expectedResult: 'validation_error',
    errorType: 'email_required',
  },
  {
    credentials: {
      email: 'student01@zinc.test',
      password: '',
      description: 'Missing password - Email provided',
    },
    expectedResult: 'validation_error',
    errorType: 'password_required',
  },
  {
    credentials: {
      email: '',
      password: '',
      description: 'Both fields empty',
    },
    expectedResult: 'validation_error',
    errorType: 'email_required',
  },
  {
    credentials: {
      email: 'student01@zinc.test',
      password: 'wrongpassword123',
      description: 'Valid email - Incorrect password',
    },
    expectedResult: 'error',
    errorType: 'invalid_credentials',
  },
  {
    credentials: {
      email: 'nonexistent@zinc.test',
      password: '9pJolA7GBQec',
      description: 'Unregistered email - Valid password',
    },
    expectedResult: 'error',
    errorType: 'user_not_found',
  },
  {
    credentials: {
      email: 'invalid-email-format',
      password: '9pJolA7GBQec',
      description: 'Invalid email format - Valid password',
    },
    expectedResult: 'validation_error',
    errorType: 'invalid_email_format',
  },
  {
    credentials: {
      email: 'test@example.com',
      password: 'testpassword123',
      description: 'Different valid format email',
    },
    expectedResult: 'error',
    errorType: 'user_not_found',
  },
];

/**
 * Email validation test cases
 */
export const EMAIL_VALIDATION_CASES = [
  {
    email: 'valid.email@example.com',
    isValid: true,
  },
  {
    email: 'student01@zinc.test',
    isValid: true,
  },
  {
    email: 'user+tag@example.co.uk',
    isValid: true,
  },
  {
    email: 'invalid.email@',
    isValid: false,
  },
  {
    email: '@example.com',
    isValid: false,
  },
  {
    email: 'invalid@.com',
    isValid: false,
  },
  {
    email: 'invalid',
    isValid: false,
  },
  {
    email: 'invalid..email@example.com',
    isValid: false,
  },
];

/**
 * Password strength test cases
 */
export const PASSWORD_STRENGTH_CASES = [
  {
    password: '9pJolA7GBQec',
    strength: 'strong',
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    length: 12,
  },
  {
    password: 'password123',
    strength: 'medium',
    hasUppercase: false,
    hasLowercase: true,
    hasNumbers: true,
    length: 11,
  },
  {
    password: 'password',
    strength: 'weak',
    hasUppercase: false,
    hasLowercase: true,
    hasNumbers: false,
    length: 8,
  },
  {
    password: 'P@ssw0rd',
    strength: 'strong',
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    length: 8,
  },
];

/**
 * Common error messages expected from the server
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  USER_NOT_FOUND: 'User account not found',
  LOGIN_FAILED: 'Login failed',
  ACCOUNT_LOCKED: 'Account is locked',
  SESSION_EXPIRED: 'Session expired',
};

/**
 * Test user roles and their expected behavior
 */
export const USER_ROLES = {
  STUDENT: {
    email: 'student01@zinc.test',
    password: '9pJolA7GBQec',
    role: 'STUDENT',
    expectedDashboard: '/dashboard',
  },
  ADMIN: {
    email: 'admin@zinc.test',
    password: 'adminPassword123',
    role: 'ADMIN',
    expectedDashboard: '/admin',
  },
  TEACHER: {
    email: 'teacher01@zinc.test',
    password: 'teacherPassword123',
    role: 'TEACHER',
    expectedDashboard: '/dashboard',
  },
};

/**
 * Test data fixtures for the Registration Form.
 * All data is purely for testing; no real user information is used.
 */

export const VALID_REGISTRATION_DATA = {
  firstName: 'John',
  lastName: 'Smith',
  username: 'johnsmith123',
  email: 'john.smith@example.com',
  password: 'SecurePass123!',
  phone: '202-555-0123',
  gender: 'Male' as const,
  dob: '01/15/1990',
  department: 'Department of Engineering',
  jobTitle: 'Developer',
  programmingLanguages: ['Java', 'JavaScript'],
};

export const INVALID_EMAIL_DATA = {
  ...VALID_REGISTRATION_DATA,
  email: 'invalid-email',
};

export const WEAK_PASSWORD_DATA = {
  ...VALID_REGISTRATION_DATA,
  password: '12345',
};

export const DUPLICATE_USERNAME_DATA = {
  ...VALID_REGISTRATION_DATA,
  // Use an existing username to trigger duplicate error
  username: 'johnsmith123',
};

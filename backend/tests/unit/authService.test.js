// Basic test for the authentication service
const AuthService = require('../../src/services/authService');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
}));

// Mock JWT functions
jest.mock('../../src/config/jwt', () => ({
  generateAccessToken: jest.fn().mockReturnValue('mocked-access-token'),
  generateRefreshToken: jest.fn().mockReturnValue('mocked-refresh-token'),
  verifyToken: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        first_name: 'Test',
        last_name: 'User',
        role: 'student',
        school_id: 1,
        date_of_birth: '2008-01-01'
      };

      User.findByEmail.mockResolvedValue(null); // No existing user
      User.create.mockResolvedValue({
        id: 1,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role
      });

      const result = await AuthService.register(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.tokens.access_token).toBe('mocked-access-token');
      expect(result.tokens.refresh_token).toBe('mocked-refresh-token');
    });

    test('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        first_name: 'Test',
        last_name: 'User',
        role: 'student',
        school_id: 1,
        date_of_birth: '2008-01-01'
      };

      User.findByEmail.mockResolvedValue({ id: 1, email: userData.email }); // User exists

      await expect(AuthService.register(userData)).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    test('should login user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const user = {
        id: 1,
        email,
        first_name: 'Test',
        last_name: 'User',
        role: 'student',
        password_hash: 'hashed-password',
        is_active: true,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findByEmail.mockResolvedValue(user);

      const result = await AuthService.login(email, password);

      expect(result.user.email).toBe(email);
      expect(result.tokens.access_token).toBe('mocked-access-token');
      expect(result.tokens.refresh_token).toBe('mocked-refresh-token');
    });

    test('should throw error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';
      const user = {
        id: 1,
        email,
        first_name: 'Test',
        last_name: 'User',
        role: 'student',
        password_hash: 'hashed-password',
        is_active: true,
        comparePassword: jest.fn().mockResolvedValue(false) // Password doesn't match
      };

      User.findByEmail.mockResolvedValue(user);

      await expect(AuthService.login(email, password)).rejects.toThrow('Invalid email or password');
    });
  });
});
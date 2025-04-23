module.exports = {
    // User roles and types
    USER_TYPES: {
      USER: 'user',
      CAREGIVER: 'caregiver',
      ADMIN: 'admin'
    },
  
    // Accessibility settings
    ACCESSIBILITY: {
      FONT_SIZES: {
        SMALL: 'small',
        MEDIUM: 'medium',
        LARGE: 'large'
      },
      CONTRAST: {
        NORMAL: 'normal',
        HIGH: 'high'
      }
    },
  
    // Service categories
    SERVICE_CATEGORIES: [
      'mobility',
      'healthcare',
      'education',
      'community',
      'government',
      'caregiver',
      'legal',
      'emergency'
    ],
  
    // Healthcare specialties
    HEALTHCARE_SPECIALTIES: [
      'physical-therapy',
      'occupational-therapy',
      'speech-therapy',
      'mental-health',
      'primary-care',
      'neurology',
      'orthopedics'
    ],
  
    // Education program types
    EDUCATION_TYPES: [
      'online-course',
      'certification',
      'degree-program',
      'workshop',
      'webinar'
    ],
  
    // Community post types
    POST_TYPES: [
      'discussion',
      'question',
      'resource',
      'story',
      'event'
    ],
  
    // Emergency contact types
    EMERGENCY_CONTACT_TYPES: [
      'police',
      'ambulance',
      'fire',
      'crisis',
      'personal'
    ],
  
    // Pagination defaults
    PAGINATION: {
      DEFAULT_LIMIT: 10,
      DEFAULT_PAGE: 1,
      MAX_LIMIT: 100
    },
  
    // Regex patterns
    REGEX: {
      EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      PHONE: /^\+?[1-9]\d{1,14}$/,
      ZIP_CODE: /^\d{5}(?:[-\s]\d{4})?$/
    },
  
    // Error messages
    ERROR_MESSAGES: {
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Forbidden',
      NOT_FOUND: 'Resource not found',
      SERVER_ERROR: 'Internal server error',
      VALIDATION_ERROR: 'Validation failed',
      INVALID_CREDENTIALS: 'Invalid credentials',
      EMAIL_IN_USE: 'Email already in use',
      TOKEN_EXPIRED: 'Token expired',
      INVALID_TOKEN: 'Invalid token'
    },
  
    // Success messages
    SUCCESS_MESSAGES: {
      USER_CREATED: 'User created successfully',
      LOGIN_SUCCESS: 'Login successful',
      PASSWORD_RESET: 'Password reset successful',
      EMAIL_VERIFIED: 'Email verified successfully',
      OPERATION_SUCCESS: 'Operation completed successfully'
    }
  };
export const responseConstant = {
  COMMON: {
    API_NOTFOUND: {
      MESSAGE: 'API not found',
      CODE: '1025'
    },
    SEND_EMAIL: {
      FAILED: {
        MESSAGE: 'Unable to send email.',
        CODE: '0001'
      },
      SUCCESS: {
        MESSAGE: 'Email successfully sent.',
        CODE: '0002'
      }
    },
    EMAIL: {
      MISSING_KEY: {
        CODE: '0004',
        MASSAGE: 'Missing SendGrid API key'
      }
    },
    REQUEST_UNDEFINED: {
      CODE: '0005',
      MASSAGE: 'Request is undefined.'
    },
    CLIENTS: {
      NOT_FOUND_EMPLOYEE: {
        CODE: '1009',
        MESSAGE: 'Employee reference not found.'
      },
      NOT_FOUND_USER: {
        CODE: '1030',
        MESSAGE: 'User reference not found.'
      },
      FAILED: {
        MESSAGE: '${error?.message}',
        CODE: '1031'
      }
    },
    VALIDATION: {
      FAILED: {
        MESSAGE: 'Validation failed',
        CODE: '1032'
      }
    },
    UNKNOWN_ERROR: {
      MESSAGE: 'Unknown errors',
      CODE: '1363'
    }
  }
};

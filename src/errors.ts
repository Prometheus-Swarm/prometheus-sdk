export class PrometheusSDKError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'PrometheusSDKError';
  }
}

export class PrometheusAPIError extends PrometheusSDKError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: any,
    code?: string
  ) {
    super(message, code);
    this.name = 'PrometheusAPIError';
  }
}

export class ValidationError extends PrometheusSDKError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends PrometheusAPIError {
  constructor(
    message: string = 'API rate limit exceeded. Please try again in 15 minutes.',
    public readonly retryAfter?: number
  ) {
    super(message, 429, null, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends PrometheusAPIError {
  constructor(message: string = 'Invalid API key or unauthorized access') {
    super(message, 401, null, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends PrometheusSDKError {
  constructor(message: string, public readonly originalError?: Error) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
} 
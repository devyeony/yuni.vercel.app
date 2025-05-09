export class BaseError extends Error {
  public readonly translationKey: string;
  public readonly statusCode: number;

  constructor(translationKey: string, statusCode = 500) {
    super(translationKey);
    this.name = this.constructor.name;
    this.translationKey = translationKey;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class CaptchaInvalidError extends BaseError {
  constructor() {
    super("captchaInvalid", 403);
  }
}

export class TooManyRequestsError extends BaseError {
  constructor() {
    super("requestTooManyAttempts", 429);
  }
}

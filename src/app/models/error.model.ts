export interface ErrorResponse {
  status: ErrorCodes;
  message: string;
  errors: string[];
}

type ErrorCodes = 400 | 404;

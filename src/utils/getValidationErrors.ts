import { ValidationError } from 'yup';

interface ErrorBag {
  [key: string]: string;
}

export default (err: ValidationError): ErrorBag => {
  const validationErrors: ErrorBag = {};

  err.inner.forEach((error: ValidationError) => {
  });
  return validationErrors;
};

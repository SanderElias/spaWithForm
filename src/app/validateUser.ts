import { ValidationErrors } from '@angular/forms';
import { UserErrors } from './user-data.service';

/**
 * Helper function to validate user data. In a separate file, so it can be reused in the backend.
 * @param data
 * @returns
 */
export function validateUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  thumbnailUrl?: string;
}): UserErrors | null {
  // This should mostly work. In practice, the only way to validate an email is by sending one with an code and ask this code back in a follow-up form!
  const emailCheck =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const errors: UserErrors = {};
  if (data.firstName.trim() === '') {
    errors.firstName = 'First-name is mandatory';
  }
  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Last-name is mandatory';
  }
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is mandatory';
  }
  if (!data.email.match(emailCheck)) {
    errors.email = `this doesn't resemble a valid email address`;
  }
  if (
    data.password.toLowerCase().includes(data.firstName) ||
    data.password.toLowerCase().includes(data.lastName)
  ) {
    // actually this would be better if it checks for parts of the names too.
    errors.password = 'Password may not contain first or last name';
  }
  const caseCheck = data.password.split('').reduce(
    (result, token) => {
      if (token.toLowerCase() === token.toUpperCase()) return result; // token has no different casings, so skip it.
      if (token === token.toLowerCase()) result.hasLowercase = true;
      if (token === token.toUpperCase()) result.hasUppercase = true;
      return result;
    },
    { hasLowercase: false, hasUppercase: false }
  );
  if (data.password.length < 9) {
    errors.password = 'Password is too short, we need 8 tokens at least';
  }
  if (caseCheck.hasLowercase === false) {
    errors.password = 'Password must have lowercase characters in it';
  }
  if (caseCheck.hasUppercase === false) {
    errors.password = 'Password must have uppercase characters in it';
  }
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is mandatory';
  }
  const hasErrors = Object.entries(errors).length !== 0;
  return hasErrors ? errors : null;
}

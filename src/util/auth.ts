const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

/**
 * Returns a validation message, or false if the username is valid
 * @param username
 * @returns
 */
export function validateUsername(username) {
  if (username.length === 0) {
    return `Can contain letters, numbers, and underscores`;
  }

  if (!USERNAME_REGEX.test(username)) {
    return "Usernames can only contain letters, numbers, and underscores (_)";
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return `Must have at least ${USERNAME_MIN_LENGTH} characters.`;
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return `Sorry, usernames can have at most ${USERNAME_MAX_LENGTH} characters.`;
  }

  return false;
}

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 60;

/**
 * Returns a validation message, or false if the password is valid.
 * @param password
 * @returns
 */
export function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Must have at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Sorry, passwords can have at most ${MAX_PASSWORD_LENGTH} characters.`;
  }

  return false;
}

import validator from 'validator';

// validate password
export const validatePassword = (password: string) => {
  // Regex expression to check for at least one capital letter, one symbol, one number, and 8 or more characters
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  return re.test(password);
};

export const validateAuthInputs = (inputs: {
  email: string;
  password: string;
  username: string;
  name: string;
  bio?: string;
}) => {
  const { email, password, username, name, bio } = inputs;

  console.log('here - validateAuthInputs');

  const errors: string[] = [];

  if (!validator.isEmail(email)) {
    errors.push('Invalid email');
  }

  if (!validatePassword(password)) {
    errors.push(
      'Password is not strong enough - must contain at least one capital letter, one symbol, one number, and 8 or more characters'
    );
  }

  if (!validator.isLength(bio || '', { max: 255 })) {
    errors.push('Bio must be less than 255 characters');
  }

  if (!validator.isLength(username, { min: 2 })) {
    errors.push('Username must be at least 2 characters');
  }

  if (!validator.isLength(name, { min: 2 })) {
    errors.push('First name must be at least 2 characters');
  }

  return errors;
};

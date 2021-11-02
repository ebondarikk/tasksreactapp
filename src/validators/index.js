import * as yup from 'yup';

const VALIDATE_MESSAGES = {
  required: 'This field is required',
  invalidEmailFormat: 'Invalid format of email',
  passwordTooShort: 'Password must contain at least 3 characters',
};

export const notEmptyString = () => yup.string().trim();

export const string = yup.object().shape({
  value: notEmptyString().required(VALIDATE_MESSAGES.required),
});

export const email = yup.object().shape({
  value: notEmptyString()
    .email(VALIDATE_MESSAGES.invalidEmailFormat)
    .required(VALIDATE_MESSAGES.required),
});

export const password = yup.object().shape({
  value: notEmptyString().min(3, VALIDATE_MESSAGES.passwordTooShort),
});

export const taskValidationSchema = yup.object().shape({
  username: string,
  email: email,
  text: string,
  status: string,
});

export const loginValidationSchema = yup.object().shape({
  username: string,
  password: password,
});

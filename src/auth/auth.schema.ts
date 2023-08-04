import * as yup from 'yup';
import { ValidationSchema } from '../validation/validation.schema';

const SignUpSchema = yup.object().shape({
	username: ValidationSchema.UsernameSchema.required('Username is required'),
	password: ValidationSchema.PasswordSchema.required('Password is required'),
	email: ValidationSchema.EmailSchema.required('Email is required'),
	avatar: ValidationSchema.AvatarSchema,
	name: ValidationSchema.NameSchema,
	surname: ValidationSchema.SurnameSchema,
	birthdate: ValidationSchema.BirthdateSchema,
});

const SignDownSchema = yup.object().shape({
	password: ValidationSchema.PasswordSchema.required('Password is required'),
});

const SignInSchema = yup.object().shape({
	email: ValidationSchema.EmailSchema.required('Email is required'),
	password: ValidationSchema.PasswordSchema.required('Password is required'),
});

const ForgotPasswordSchema = yup.object().shape({
	email: ValidationSchema.EmailSchema.required('Email is required'),
});

const ChangePasswordSchema = yup.object().shape({
	password: ValidationSchema.PasswordSchema.required('Password is required'),
});

export const AuthSchema = {
	SignUpSchema,
	SignDownSchema,
	SignInSchema,
	ForgotPasswordSchema,
	ChangePasswordSchema,
};

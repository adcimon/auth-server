import * as yup from 'yup';
import { ValidationSchema } from '../validation/validation.schema';

export namespace AuthSchema {
	export const SignUpBody = yup.object().shape({
		username: ValidationSchema.UsernameSchema.required('Username is required'),
		password: ValidationSchema.PasswordSchema.required('Password is required'),
		email: ValidationSchema.EmailSchema.required('Email is required'),
		avatar: ValidationSchema.AvatarSchema,
		name: ValidationSchema.NameSchema,
		surname: ValidationSchema.SurnameSchema,
		birthdate: ValidationSchema.BirthdateSchema,
	});

	export const SignDownBody = yup.object().shape({
		password: ValidationSchema.PasswordSchema.required('Password is required'),
	});

	export const SignInBody = yup.object().shape({
		email: ValidationSchema.EmailSchema.required('Email is required'),
		password: ValidationSchema.PasswordSchema.required('Password is required'),
	});

	export const ForgotPasswordBody = yup.object().shape({
		email: ValidationSchema.EmailSchema.required('Email is required'),
	});

	export const ChangePasswordBody = yup.object().shape({
		password: ValidationSchema.PasswordSchema.required('Password is required'),
	});
}

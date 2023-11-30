import * as yup from 'yup';
import { ValidationSchema } from '../validation/validation.schema';

export namespace UsersSchema {
	export const UpdateMyUsernameBody = yup.object().shape({
		username: ValidationSchema.UsernameSchema.required('Username is required'),
		password: ValidationSchema.PasswordSchema.required('Password is required'),
	});

	export const UpdateUsernameBody = yup.object().shape({
		username: ValidationSchema.UsernameSchema.required('Username is required'),
	});

	export const UpdateMyEmailBody = yup.object().shape({
		email: ValidationSchema.EmailSchema.required('Email is required'),
	});

	export const UpdateMyPasswordBody = yup.object().shape({
		currentPassword: ValidationSchema.PasswordSchema.required('Current password is required'),
		newPassword: ValidationSchema.PasswordSchema.required('New password is required'),
	});

	export const UpdateMyAvatarBody = yup.object().shape({
		avatar: ValidationSchema.AvatarSchema.defined('Avatar is required'),
	});

	export const UpdateAvatarBody = yup.object().shape({
		avatar: ValidationSchema.AvatarSchema.defined('Avatar is required'),
	});

	export const UpdateMyNameBody = yup.object().shape({
		name: ValidationSchema.NameSchema.defined('Name is required'),
	});

	export const UpdateNameBody = yup.object().shape({
		name: ValidationSchema.NameSchema.defined('Name is required'),
	});

	export const UpdateMySurnameBody = yup.object().shape({
		surname: ValidationSchema.SurnameSchema.defined('Surname is required'),
	});

	export const UpdateSurnameBody = yup.object().shape({
		surname: ValidationSchema.SurnameSchema.defined('Surname is required'),
	});

	export const UpdateMyBirthdateBody = yup.object().shape({
		birthdate: ValidationSchema.BirthdateSchema.required('Birthdate is required'),
	});

	export const UpdateBirthdateBody = yup.object().shape({
		birthdate: ValidationSchema.BirthdateSchema.required('Birthdate is required'),
	});
}

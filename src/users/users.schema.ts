import * as yup from 'yup';
import { ValidationSchema } from '../validation/validation.schema';

const UpdateMyUsernameSchema = yup.object().shape({
	username: ValidationSchema.UsernameSchema.required('Username is required'),
	password: ValidationSchema.PasswordSchema.required('Password is required'),
});

const UpdateUsernameSchema = yup.object().shape({
	username: ValidationSchema.UsernameSchema.required('Username is required'),
});

const UpdateMyEmailSchema = yup.object().shape({
	email: ValidationSchema.EmailSchema.required('Email is required'),
});

const UpdateMyPasswordSchema = yup.object().shape({
	currentPassword: ValidationSchema.PasswordSchema.required('Current password is required'),
	newPassword: ValidationSchema.PasswordSchema.required('New password is required'),
});

const UpdateMyAvatarSchema = yup.object().shape({
	avatar: ValidationSchema.AvatarSchema.defined('Avatar is required'),
});

const UpdateAvatarSchema = yup.object().shape({
	avatar: ValidationSchema.AvatarSchema.defined('Avatar is required'),
});

const UpdateMyNameSchema = yup.object().shape({
	name: ValidationSchema.NameSchema.defined('Name is required'),
});

const UpdateNameSchema = yup.object().shape({
	name: ValidationSchema.NameSchema.defined('Name is required'),
});

const UpdateMySurnameSchema = yup.object().shape({
	surname: ValidationSchema.SurnameSchema.defined('Surname is required'),
});

const UpdateSurnameSchema = yup.object().shape({
	surname: ValidationSchema.SurnameSchema.defined('Surname is required'),
});

const UpdateMyBirthdateSchema = yup.object().shape({
	birthdate: ValidationSchema.BirthdateSchema.required('Birthdate is required'),
});

const UpdateBirthdateSchema = yup.object().shape({
	birthdate: ValidationSchema.BirthdateSchema.required('Birthdate is required'),
});

const DeleteUserSchema = yup.object().shape({});

export const UsersSchema = {
	UpdateMyUsernameSchema,
	UpdateUsernameSchema,
	UpdateMyEmailSchema,
	UpdateMyPasswordSchema,
	UpdateMyAvatarSchema,
	UpdateAvatarSchema,
	UpdateMyNameSchema,
	UpdateNameSchema,
	UpdateMySurnameSchema,
	UpdateSurnameSchema,
	UpdateMyBirthdateSchema,
	UpdateBirthdateSchema,
	DeleteUserSchema,
};

import * as yup from 'yup';
import { isDate, parse } from 'date-fns';

const USERNAME_REGEXP = /^[a-zA-Z]+(.){2,20}$/;
const USERNAME_MESSAGE = 'Username must start with an alpha character and contain from 3 to 20 characters';

const PASSWORD_REGEXP = /^[a-zA-Z]+(.){7,20}$/;
const PASSWORD_MESSAGE = 'Password must start with an alpha character and contain from 8 to 20 characters';

yup.addMethod(yup.string, 'defined', function (msg = 'Parameter must be defined') {
	return this.test('defined', msg, (value) => value !== undefined && value !== null);
});

function parseDateString(value, originalValue) {
	const parsedDate: any = isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date());
	return parsedDate;
}

const UsernameSchema = yup.string().matches(USERNAME_REGEXP, USERNAME_MESSAGE);
const EmailSchema = yup.string().email();
const PasswordSchema = yup.string().matches(PASSWORD_REGEXP, PASSWORD_MESSAGE);
const AvatarSchema = yup.string().url().max(500);
const NameSchema = yup.string().max(15);
const SurnameSchema = yup.string().max(15);
const BirthdateSchema = yup.date().transform(parseDateString).typeError('Invalid birthdate format YYYY/MM/DD');
const TokenSchema = yup.string();

const SignUpSchema = yup.object().shape({
	username: UsernameSchema.required('Username is required'),
	password: PasswordSchema.required('Password is required'),
	email: EmailSchema.required('Email is required'),
	avatar: AvatarSchema,
	name: NameSchema,
	surname: SurnameSchema,
	birthdate: BirthdateSchema,
});

const SignDownSchema = yup.object().shape({
	password: PasswordSchema.required('Password is required'),
});

const SignInSchema = yup.object().shape({
	email: EmailSchema.required('Email is required'),
	password: PasswordSchema.required('Password is required'),
});

const ForgotPasswordSchema = yup.object().shape({
	email: EmailSchema.required('Email is required'),
});

const ChangePasswordSchema = yup.object().shape({
	password: PasswordSchema.required('Password is required'),
});

const UpdateMyUsernameSchema = yup.object().shape({
	username: UsernameSchema.required('Username is required'),
	password: PasswordSchema.required('Password is required'),
});

const UpdateUsernameSchema = yup.object().shape({
	username: UsernameSchema.required('Username is required'),
});

const UpdateMyEmailSchema = yup.object().shape({
	email: EmailSchema.required('Email is required'),
});

const UpdateMyPasswordSchema = yup.object().shape({
	currentPassword: PasswordSchema.required('Current password is required'),
	newPassword: PasswordSchema.required('New password is required'),
});

const UpdateMyAvatarSchema = yup.object().shape({
	avatar: AvatarSchema.defined('Avatar is required'),
});

const UpdateAvatarSchema = yup.object().shape({
	avatar: AvatarSchema.defined('Avatar is required'),
});

const UpdateMyNameSchema = yup.object().shape({
	name: NameSchema.defined('Name is required'),
});

const UpdateNameSchema = yup.object().shape({
	name: NameSchema.defined('Name is required'),
});

const UpdateMySurnameSchema = yup.object().shape({
	surname: SurnameSchema.defined('Surname is required'),
});

const UpdateSurnameSchema = yup.object().shape({
	surname: SurnameSchema.defined('Surname is required'),
});

const UpdateMyBirthdateSchema = yup.object().shape({
	birthdate: BirthdateSchema.required('Birthdate is required'),
});

const UpdateBirthdateSchema = yup.object().shape({
	birthdate: BirthdateSchema.required('Birthdate is required'),
});

const DeleteUserSchema = yup.object().shape({});

export const ValidationSchema = {
	UsernameSchema,
	TokenSchema,
	SignUpSchema,
	SignDownSchema,
	SignInSchema,
	ForgotPasswordSchema,
	ChangePasswordSchema,
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

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

export const ValidationSchema = {
	UsernameSchema,
	EmailSchema,
	PasswordSchema,
	AvatarSchema,
	NameSchema,
	SurnameSchema,
	BirthdateSchema,
	TokenSchema,
};

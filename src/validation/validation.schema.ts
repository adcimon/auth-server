import * as yup from 'yup';
import { isDate, parse } from "date-fns";

const USERNAME_REGEXP = /^[a-zA-Z]+(.){4,20}$/;
const USERNAME_MESSAGE = "Username must start with an alpha character and contain from 5 to 20 characters";

const PASSWORD_REGEXP = /^[a-zA-Z]+(.){7,20}$/;
const PASSWORD_MESSAGE = "Password must start with an alpha character and contain from 8 to 20 characters";

function parseDateString( value, originalValue )
{
    const parsedDate = isDate(originalValue) ? originalValue : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

export const RegisterSchema = yup.object().shape(
{
    username:           yup.string().required('Username is required').matches(USERNAME_REGEXP, USERNAME_MESSAGE),
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE),
    email:              yup.string().email().required('Email is required'),
    avatar:             yup.string().url().max(500),
    name:               yup.string().max(15),
    surname:            yup.string().max(15),
    birthdate:          yup.date().transform(parseDateString).typeError('Invalid birthdate format YYYY/MM/DD'),
    role:               yup.number().integer()
});

export const LoginSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required'),
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE)
});

export const ForgotPasswordSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required')
});

export const ResetPasswordSchema = yup.object().shape(
{
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE)
});

export const UpdateUsernameSchema = yup.object().shape(
{
    username:           yup.string().required('Username is required').matches(USERNAME_REGEXP, USERNAME_MESSAGE),
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE)
});

export const UpdatePasswordSchema = yup.object().shape(
{
    currentPassword:    yup.string().required('Current password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE),
    newPassword:        yup.string().required('New password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE)
});

export const UpdateAvatarSchema = yup.object().shape(
{
    avatar:             yup.string().url().required('Avatar is required').max(500)
});

export const UpdateNameSchema = yup.object().shape(
{
    name:               yup.string().required('Name is required').max(15)
});

export const UpdateSurnameSchema = yup.object().shape(
{
    surname:            yup.string().required('Surname is required').max(15)
});

export const UpdateBirthdateSchema = yup.object().shape(
{
    birthdate:          yup.date().required('Birthdate is required').transform(parseDateString).typeError('Invalid birthdate format YY/MM/DD')
});

export const DeleteSchema = yup.object().shape(
{
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE)
});
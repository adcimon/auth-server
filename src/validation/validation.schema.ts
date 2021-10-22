import * as yup from 'yup';
import { isDate, parse } from "date-fns";

function parseDateString( value, originalValue )
{
    const parsedDate = isDate(originalValue) ? originalValue : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const PASSWORD_MESSAGE = "Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and one special case character";

export const RegisterSchema = yup.object().shape(
{
    username:           yup.string().min(3).max(15).required('Username is required').typeError('Invalid username'),
    password:           yup.string().min(8).max(50).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password'),
    email:              yup.string().email().required('Email is required').typeError('Invalid email'),
    avatar:             yup.string().min(8).max(100).typeError('Invalid avatar'),
    name:               yup.string().max(15).typeError('Invalid name'),
    surname:            yup.string().max(15).typeError('Invalid surname'),
    birthdate:          yup.date().transform(parseDateString).typeError('Invalid birthdate'),
    role:               yup.number().integer().typeError('Invalid role')
});

export const LoginSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required').typeError('Invalid email'),
    password:           yup.string().min(8).max(50).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const ForgotPasswordSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required').typeError('Invalid email')
});

export const ResetPasswordSchema = yup.object().shape(
{
    password:           yup.string().min(8).max(50).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const UpdateUsernameSchema = yup.object().shape(
{
    username:           yup.string().min(3).max(15).required('Username is required').typeError('Invalid username'),
    password:           yup.string().min(8).max(50).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const UpdatePasswordSchema = yup.object().shape(
{
    currentPassword:    yup.string().min(8).max(50).required('Current password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid current password'),
    newPassword:        yup.string().min(8).max(50).required('New password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid new password')
});

export const UpdateAvatarSchema = yup.object().shape(
{
    avatar:             yup.string().min(8).max(100).required('Avatar is required').typeError('Invalid avatar')
});

export const UpdateNameSchema = yup.object().shape(
{
    name:               yup.string().max(15).required('Name is required').typeError('Invalid name')
});

export const UpdateSurnameSchema = yup.object().shape(
{
    surname:            yup.string().max(15).required('Surname is required').typeError('Invalid surname')
});

export const UpdateBirthdateSchema = yup.object().shape(
{
    birthdate:          yup.date().transform(parseDateString).required('Birthdate is required').typeError('Invalid birthdate')
});

export const DeleteSchema = yup.object().shape(
{
    password:           yup.string().min(8).max(50).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});
import * as yup from 'yup';
import { isDate, parse } from "date-fns";

/**
 * Password Regular Expression
 *
 * (?=.*\d)          Should contain at least one digit.
 * (?=.*[a-z])       Should contain at least one lower case.
 * (?=.*[A-Z])       Should contain at least one upper case.
 * [a-zA-Z0-9]{8,}   Should contain at least 8 from the previous characters.
 * 
 */
const PASSWORD_MIN_CHARS = 8;
const PASSWORD_MAX_CHARS = 50;
const PASSWORD_REGEXP = new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{' + PASSWORD_MIN_CHARS + ',}$');
const PASSWORD_MESSAGE = "Must contain 8 characters, 1 lowercase, 1 uppercase and 1 number";

function parseDateString( value, originalValue )
{
    const parsedDate = isDate(originalValue) ? originalValue : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

export const RegisterSchema = yup.object().shape(
{
    username:           yup.string().min(3).max(15).required('Username is required').typeError('Invalid username'),
    password:           yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password'),
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
    password:           yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const ForgotPasswordSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required').typeError('Invalid email')
});

export const ResetPasswordSchema = yup.object().shape(
{
    password:           yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const GetAvatarSchema = yup.object().shape(
{
    username:           yup.string().min(3).max(15).required('Username is required').typeError('Invalid username')
});

export const UpdateUsernameSchema = yup.object().shape(
{
    username:           yup.string().min(3).max(15).required('Username is required').typeError('Invalid username'),
    password:           yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const UpdatePasswordSchema = yup.object().shape(
{
    currentPassword:    yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Current password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid current password'),
    newPassword:        yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('New password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid new password')
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
    password:           yup.string().min(PASSWORD_MIN_CHARS).max(PASSWORD_MAX_CHARS).required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});
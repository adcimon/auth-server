import * as yup from 'yup';
import { isDate, parse } from "date-fns";

/**
 * Password Regular Expression
 *
 * (?=.*\d)             Should contain at least 1 digit.
 * (?=.*[a-z])          Should contain at least 1 lower case.
 * (?=.*[A-Z])          Should contain at least 1 upper case.
 * [a-zA-Z0-9]{8,20}    Should contain from 8 to 20 from the previous characters.
 * 
 */
const PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
const PASSWORD_MESSAGE = "Password must contain from 8 to 20 characters, 1 lowercase, 1 uppercase and 1 number";

function parseDateString( value, originalValue )
{
    const parsedDate = isDate(originalValue) ? originalValue : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

export const RegisterSchema = yup.object().shape(
{
    username:           yup.string().required('Username is required').min(3).max(15).typeError('Invalid username'),
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password'),
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
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const ForgotPasswordSchema = yup.object().shape(
{
    email:              yup.string().email().required('Email is required').typeError('Invalid email')
});

export const ResetPasswordSchema = yup.object().shape(
{
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const GetAvatarSchema = yup.object().shape(
{
    username:           yup.string().required('Username is required').min(3).max(15).typeError('Invalid username')
});

export const UpdateUsernameSchema = yup.object().shape(
{
    username:           yup.string().required('Username is required').min(3).max(15).typeError('Invalid username'),
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});

export const UpdatePasswordSchema = yup.object().shape(
{
    currentPassword:    yup.string().required('Current password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid current password'),
    newPassword:        yup.string().required('New password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid new password')
});

export const UpdateAvatarSchema = yup.object().shape(
{
    avatar:             yup.string().required('Avatar is required').min(8).max(100).typeError('Invalid avatar')
});

export const UpdateNameSchema = yup.object().shape(
{
    name:               yup.string().required('Name is required').max(15).typeError('Invalid name')
});

export const UpdateSurnameSchema = yup.object().shape(
{
    surname:            yup.string().required('Surname is required').max(15).typeError('Invalid surname')
});

export const UpdateBirthdateSchema = yup.object().shape(
{
    birthdate:          yup.date().required('Birthdate is required').transform(parseDateString).typeError('Invalid birthdate')
});

export const DeleteSchema = yup.object().shape(
{
    password:           yup.string().required('Password is required').matches(PASSWORD_REGEXP, PASSWORD_MESSAGE).typeError('Invalid password')
});
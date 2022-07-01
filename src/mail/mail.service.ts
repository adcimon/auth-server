import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { User } from '../user/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService
{
    private logger = new Logger('MAIL');

    private transporter: any;

    constructor( private readonly configService: ConfigService )
    {
        this.transporter = nodemailer.createTransport(
        {
            host: configService.get('MAIL_HOST'),
            port: configService.get('MAIL_PORT'),
            secure: configService.get('MAIL_SECURE'),
            auth: {
                user: configService.get('MAIL_USER'),
                pass: configService.get('MAIL_PASSWORD')
            }
        });
    }

    /**
     * Send a mail.
     */
    async sendMail( options: any ): Promise<boolean>
    {
        return new Promise( (resolve, reject) =>
        {
            this.transporter.sendMail(options, (error, info) =>
            {
                if( error )
                {
                    this.logger.log(`Mail from ${options.from} to ${options.to} NOT sent: ${error.message}`);
                    resolve(false);
                }
                else
                {
                    this.logger.log(`Mail from ${options.from} to ${options.to} sent`);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Send a verification mail.
     */
    async sendVerificationMail( user: User, link: string ): Promise<boolean>
    {
        const serviceName = await this.configService.getServiceName();
        const expirationTime = await this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME');
        const from = await this.configService.get('MAIL_NOREPLY_FROM');

        let html =
        `
        <p style="font-size: 25px">
            Hi ${user.name},
        </p>
        <p style="font-size: 15px">
            Welcome! We are happy you signed up on ${serviceName}. Please verify your email address.
        </p>
        <p style="margin: 50px 0px 50px 10px">
            <a href="${link}" style="background-color: hsla(195, 100%, 36%, 1); border: none; border-radius: 25px; color: white; cursor: pointer; font-size: 16px; margin: 4px 2px; padding: 15px 32px; text-align: center; text-decoration: none;">
                Verify Email
            </a>
        </p>
        <p style="font-size: 20px">
            The ${serviceName} Team.
        </p>
        <p>
            Ignore this email if you didn't signed up. This verification link will expire in ${expirationTime}.
        </p>
        `;

        const options =
        {
            from: from,
            to: user.email,
            subject: `Thank you for signing up for ${serviceName}`,
            html: html
        };

        return await this.sendMail(options);
    }

    /**
     * Send a reset password mail.
     */
    async sendResetPasswordMail( user: User, link: string ): Promise<boolean>
    {
        const serviceName = await this.configService.getServiceName();
        const expirationTime = await this.configService.get('TOKEN_RESET_PASSWORD_EXPIRATION_TIME');
        const from = await this.configService.get('MAIL_NOREPLY_FROM');

        let html =
        `
        <p style="font-size: 25px">
            Hi ${user.name},
        </p>
        <p style="font-size: 15px">
            We got your request to change your password!
        </p>
        <p style="margin: 50px 0px 50px 10px">
            <a href="${link}" style="background-color: hsla(195, 100%, 36%, 1); border: none; border-radius: 25px; color: white; cursor: pointer; font-size: 16px; margin: 4px 2px; padding: 15px 32px; text-align: center; text-decoration: none;">
                Reset Password
            </a>
        </p>
        <p style="font-size: 15px">
            Just so you know: You have ${expirationTime} to pick your password. After that, you'll have to ask for a new one.
        </p>
        <p style="font-size: 20px">
            The ${serviceName} Team.
        </p>
        <p>
            Didn't ask for a new password? You can ignore this email.
        </p>
        `;

        const options =
        {
            from: from,
            to: user.email,
            subject: `Reset your password on ${serviceName}`,
            html: html
        };

        return await this.sendMail(options);
    }

    async sendChangeEmailMail( email: string, link: string ): Promise<boolean>
    {
        const serviceName = await this.configService.getServiceName();
        const expirationTime = await this.configService.get('TOKEN_CHANGE_EMAIL_EXPIRATION_TIME');
        const from = await this.configService.get('MAIL_NOREPLY_FROM');

        let html =
        `
        <p style="font-size: 25px">
            Hi,
        </p>
        <p style="font-size: 15px">
            You have requested an email change on ${serviceName}. Please confirm your email address change.
        </p>
        <p style="margin: 50px 0px 50px 10px">
            <a href="${link}" style="background-color: hsla(195, 100%, 36%, 1); border: none; border-radius: 25px; color: white; cursor: pointer; font-size: 16px; margin: 4px 2px; padding: 15px 32px; text-align: center; text-decoration: none;">
                Confirm
            </a>
        </p>
        <p style="font-size: 20px">
            The ${serviceName} Team.
        </p>
        <p>
            Ignore this email if you haven't requested an email change on ${serviceName}. This verification link will expire in ${expirationTime}.
        </p>
        `;

        const options =
        {
            from: from,
            to: email,
            subject: `Change your email on ${serviceName}`,
            html: html
        };

        return await this.sendMail(options);
    }
}
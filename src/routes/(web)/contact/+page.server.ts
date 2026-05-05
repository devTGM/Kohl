import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import {
	CONTACT_FROM_EMAIL,
	CONTACT_TO_EMAIL,
	SMTP_HOST,
	SMTP_PASSWORD,
	SMTP_PORT,
	SMTP_USER
} from '$env/static/private';
import type { Actions } from './$types';

type ContactValues = {
	name: string;
	email: string;
	phone: string;
	message: string;
};

type ActionResponse = {
	success?: boolean;
	message?: string;
	errors?: Record<string, string>;
	values?: ContactValues;
};

const smtpPort = Number(SMTP_PORT) || 587;
const emailConfigured = SMTP_HOST && SMTP_USER && SMTP_PASSWORD && CONTACT_TO_EMAIL;

const transporter = emailConfigured
	? nodemailer.createTransport({
			host: SMTP_HOST,
			port: smtpPort,
			secure: smtpPort === 465,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASSWORD
			}
		})
	: null;

const sanitize = (value: FormDataEntryValue | null) =>
	typeof value === 'string' ? value.trim() : '';

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		const values: ContactValues = {
			name: sanitize(formData.get('name')),
			email: sanitize(formData.get('email')),
			phone: sanitize(formData.get('phone')),
			message: sanitize(formData.get('message'))
		};

		const errors: Record<string, string> = {};

		if (!values.name) errors.name = 'Name is required.';
		if (!values.email) errors.email = 'Email is required.';
		else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email.';
		if (!values.message) errors.message = 'Message is required.';

		if (Object.keys(errors).length) {
			return fail(400, { errors, values } satisfies ActionResponse);
		}

		if (!transporter) {
			console.error('Contact form email is not configured');
			return fail(500, {
				message: 'Contact form is not configured yet. Please try again later.',
				values
			} satisfies ActionResponse);
		}

		const clientIp = getClientAddress?.();
		const fromAddress = CONTACT_FROM_EMAIL || SMTP_USER;

		const htmlMessage = escapeHtml(values.message).replace(/\n/g, '<br>');
		const htmlBody = `
      <p>New contact submission from Kohl & Spice.</p>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Phone:</strong> ${values.phone ? escapeHtml(values.phone) : 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${htmlMessage}</p>
      ${clientIp ? `<p><strong>IP:</strong> ${clientIp}</p>` : ''}
    `;

		const textBody = `New contact submission from Kohl & Spice.

Name: ${values.name}
Email: ${values.email}
Phone: ${values.phone || 'Not provided'}

Message:
${values.message}

${clientIp ? `IP: ${clientIp}` : ''}`.trim();

		try {
			await transporter.sendMail({
				from: fromAddress,
				to: CONTACT_TO_EMAIL,
				replyTo: values.email,
				subject: `New contact from ${values.name}`,
				text: textBody,
				html: htmlBody
			});

			return {
				success: true,
				message: 'Thanks for reaching out. We will get back to you shortly.'
			} satisfies ActionResponse;
		} catch (error) {
			console.error('Contact form email failed', error);
			return fail(500, {
				message: 'We could not send your message right now. Please try again later.',
				values
			} satisfies ActionResponse);
		}
	}
};

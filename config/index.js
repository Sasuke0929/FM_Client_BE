import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

export const SERVER_URI = process.env.SERVER_URI || "10.10.11.204";
export const SERVER_PORT = process.env.SERVER_PORT || 8000;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const JWT_SECRET_KEY = process.env.secretkey;

export const TWILIO_ACCOUNT_ID = process.env.TWILIO_ACCOUNT_ID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export const conn = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'foreverhere'
});
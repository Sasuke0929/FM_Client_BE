import {TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN} from '../config';
import cron from 'node-cron';
import {conn} from '../config';

import twilio from 'twilio';

const client = new twilio(TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN);

export const savemessage = (req, res, next) => {
	const sql = `INSERT INTO forevermessages (fromemail, toemail, from_mobilenumber, to_mobilenumber, subject, medianame, receiver_name, sending_date, message, message_status) VALUES ('${req.params.email}', '${req.body.data.email}', '${req.params.mobilenumber}', '${req.body.data.mobile}', '${req.body.data.subject}', '${req.file.filename}', '${req.body.data.name}', '${req.body.data.eventdate}', '${req.body.data.message}', false)`;

	db.query(sql, (err, response) => {
		console.log('saved');
	});
}

cron.schedule('1-5 * * * *', () => {
	const newyear = new Date().getUTCFullYear();
	const newmonth = new Date().getUTCMonth() + 1;
	const newday = new Date().getUTCDate();
	const sql = `select * from forevermessages where message_status = false AND YEAR(sending_date) = ${newyear} AND MONTH(sending_date) = ${newmonth} AND DAY(sending_date) = ${newday}`;

	db.query(sql, (err, response) => {
		if(response.length){
			if(response.length === 0){

				//------------------- To email sending -------//
				client.messages
			      .create({
			         body: response[0].message,
			         from: response[0].fromemail,
			         mediaUrl: ['https://foreverhere.co.uk/forevermessage'],
			         to: response[0].toemail
			       })
			      .then(message => console.log(message.sid));

			    //------------------- To phone sending -------//
			    client.messages
			      .create({
			         body: response[0].message,
			         from: response[0].from_mobilenumber,
			         mediaUrl: ['https://foreverhere.co.uk/forevermessage'],
			         to: response[0].to_mobilenumber
			       })
			      .then(message => console.log(message.sid));
			}else{
				response.map((item, index) => {
					client.messages
				      .create({
				         body: response[index].message,
				         from: response[index].fromemail,
				         mediaUrl: ['https://foreverhere.co.uk/forevermessage'],
				         to: response[index].toemail
				       })
				      .then(message => console.log(message.sid));

				    //------------------- To phone sending -------//
				    client.messages
				      .create({
				         body: response[index].message,
				         from: response[index].from_mobilenumber,
				         mediaUrl: ['https://foreverhere.co.uk/forevermessage'],
				         to: response[index].to_mobilenumber
				       })
				      .then(message => console.log(message.sid));
				})
			}
		}else{
			return;
		}
	})
})
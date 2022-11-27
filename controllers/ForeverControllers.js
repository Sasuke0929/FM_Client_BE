import {TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN} from '../config';
import cron from 'node-cron';
import {conn} from '../config';

import twilio from 'twilio';

const client = new twilio(TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN);

export const savemessage = (req, res, next) => {
	const {email, mobile, subject, name, eventdate, message} = JSON.parse(req.body.details);
	const sql = `INSERT INTO forevermessages (fromemail, toemail, from_mobilenumber, to_mobilenumber, subject, medianame, receiver_name, sending_date, message, message_status) VALUES ('${req.params.email}', '${email}', '${req.params.mobilenumber}', '${mobile}', '${subject}', '${req.file.filename}', '${name}', '${eventdate}', '${message}', false)`;

	conn.query(sql, (err, response) => {
		console.log('saved');
	});
}

cron.schedule('* * * * *', () => {
	const newyear = new Date().getUTCFullYear();
	const newmonth = new Date().getUTCMonth() + 1;
	const newday = new Date().getUTCDate();
	const sql = `select * from forevermessages where message_status = false AND YEAR(sending_date) = ${newyear} AND MONTH(sending_date) = ${newmonth} AND DAY(sending_date) = ${newday}`;

	conn.query(sql, (err, response) => {
		if(response.length){
			console.log(response.length+' messages sent...');
			response.map((item, index) => {

				//------------------- To email sending -------//
			    client.messages
			      .create({
			         body: item.message,
			         from: item.fromemail,
			         mediaUrl: [`http://178.128.161.142:8080/api/uploads/${item.medianame}`],
			         to: item.toemail
			       })
			      .then(message => console.log(message.sid));


			    const sql1 = `UPDATE forevermessages SET message_status = true WHERE YEAR(sending_date) = ${newyear} AND MONTH(sending_date) = ${newmonth} AND DAY(sending_date) = ${newday}`;

					conn.query(sql1, function(err, docs){
						if(err) throw err;

						docs.message_status = true;
					});

				const sql2 = `UPDATE add_ons SET message_status = true WHERE YEAR(sending_date) = ${newyear} AND MONTH(sending_date) = ${newmonth} AND DAY(sending_date) = ${newday}`;

					conn.query(sql1, function(err, docs){
						if(err) throw err;

						docs.message_status = true;
					});

			    //------------------- To phone sending -------//
			    client.messages
			      .create({
			         body: item.message,
			         from: item.from_mobilenumber,
			         mediaUrl: ['http://178.128.161.142/forevermessage'],
			         to: item.to_mobilenumber
			       })
			      .then(message => console.log(message.sid));
			})
		}else{
			return;
		}
	})
});

export const getfmmessage = (req, res, next) => {
	const sql = `select SUM(forever_message_number) as forever_message_number from add_ons where user = '${req.params.email}'`;
	conn.query(sql, function(err, docs){
		if(err) throw err;

		res.json(docs);
	});
}
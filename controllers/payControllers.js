const stripe = require("stripe")(STRIPE_SECRET_KEY);
import {STRIPE_SECRET_KEY} from '../config';
import {conn} from '../config';

export const addon_payment = async (req, res, next) => {
	const { currency, money, email, fm_num } = req.body;

  	const paymentIntent = await stripe.paymentIntents.create({
    	amount: 100 * money,
    	currency,
    	automatic_payment_methods: {
	     enabled: true,
	   },
  	});

  	if (!paymentIntent){
  		res.send({success:false, msg:'Payment unsuccessful !'});
  	}
  	else{
  		conn.query(`SELECT * FROM users WHERE email = '${email}'`, function(err, user){
			if(user){
				const sql = `UPDATE users SET hasfm = true WHERE email = '${email}'`;

				conn.query(sql, function(err, docs){
					if(err) throw err;

					docs.hasfm = true;
				});
			}
			else{
				return;
			}
		});

  		const sql1 = `SELECT * FROM add_ons WHERE user = '${email}'`;

		conn.query(sql1, function(err, docs){
			if(docs.length){
				const inserted_fm_num = docs[0].forever_message_number + fm_num;
				const sql2 = `UPDATE add_ons SET forever_message_number = ${inserted_fm_num} WHERE user = '${email}'`;

				conn.query(sql2, function(err, docs){
					if(err) throw err;

					res.send({
					   clientSecret: paymentIntent.client_secret,
					});
				});
			}else{
				const sql3 = `INSERT INTO add_ons (user, forever_message_number) VALUES ('${email}', '${fm_num}')`;
				conn.query(sql3, function(err, docs){
					if(err) throw err;

					res.send({
					   clientSecret: paymentIntent.client_secret,
					});
				});
			}
		});
  	}
}
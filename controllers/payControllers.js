const stripe = require("stripe")(STRIPE_SECRET_KEY);
import {STRIPE_SECRET_KEY} from '../config';
import {conn} from '../config';

export const addon_payment = async (req, res, next) => {
	const { token, currency, price, email, fm_num } = req.body;

  	const charge = await stripe.charges.create({
    	amount: 100 * price,
    	currency,
    	source: token,
  	});

  	if (!charge){
  		res.send({success:false, msg:'Payment unsuccessful !'});
  	}
  	else{
  		const sql = `UPDATE users SET hasfm = true WHERE email = '${email}'`;

		conn.query(sql, function(err, docs){
			if(err) throw err;

			docs.hasfm = true;
			console.log("updated:", docs);
		});

		const sql1 = `INSERT INTO add_ons (user, card_id, payment_money, payment_currency, forever_message_number) VALUES ('${email}', '${charge.source.id}', '${price}', '${currency}', '${fm_num}')`;

		conn.query(sql1, function(err, docs){
			if(err) throw err;

			res.json({success:true, chargestatus: charge});
		});
  	}
}
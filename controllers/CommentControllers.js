import {conn} from '../config';

export const getcomments = (req, res, next) => {
	const sql = `select * from comments where comment_id = '${req.params.id}'`;

	conn.query(sql, (err, response) => {
		if(err) throw err;

		res.json(response);
	});
}

export const leavecomment = (req, res, next) => {
	const sql = `INSERT INTO comments (comment_id, firstname, lastname, comment) VALUES ('${req.params.id}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.comment}')`;

	conn.query(sql, (err, response) => {
		if (err) throw err;

		res.json({success: true, newComment: response});
	});
}
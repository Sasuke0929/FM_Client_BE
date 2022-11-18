import {conn} from '../config';

export const gettimeline_content = (req, res, next) => {
	const sql = `select * from timelines where timeline_id = ${req.params.id} AND milestone_year = ${req.params.year}`;
	conn.query(sql, (err, response) => {
		res.json(response);
	});
}

export const uploadevent = (req, res, next) => {
	const newyear = new Date(req.body.milestone_date).getUTCFullYear();
	const newmonth = new Date(req.body.milestone_date).getUTCMonth() + 1;
	const sql = `select * from timelines where milestone_year = ${newyear} AND milestone_month = ${newmonth}`;
	conn.query(sql, (err, response) => {
		if(response.length){
			res.json({success:false, msg:`Timeline existed already`});
		}else{
			const sql1 = `INSERT INTO timelines (timeline_id, milestone_title, milestone_content, milestone_year, milestone_month, milestone_flag) VALUES ('${req.params.id}', '${req.body.milestone_title}', '${req.body.milestone_content}', '${newyear}', '${newmonth}', true)`;

			conn.query(sql1, (err, response) => {
				res.json({ success: true, milestone_year: newyear, milestone_month: newmonth });
			});
		}
	});
}

export const uploadeventimage = (req, res, next) => {
	const sql = `UPDATE timelines SET milestone_img = '${req.file.filename}' WHERE milestone_year = ${req.params.year} AND milestone_month = ${req.params.month}`;

	conn.query(sql, function(err, docs){
		if(err) throw err;

		docs.milestone_img = req.file.filename;
		res.json({ success: true });
	});
}

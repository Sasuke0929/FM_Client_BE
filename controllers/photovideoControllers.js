import {conn} from '../config';

export const getmyphotoes = (req, res, next) => {
	const sql = `select * from photos_videos where photo_and_video_id = ${req.params.id}`;

	conn.query(sql, (err, response) => {
		console.log(response);
		res.json(response);
	});
}

export const uploadmydata = (req, res, next) => {
	req.files.file.map((item,index) => {
		const sql = `INSERT INTO photos_videos (photo_and_video_id, photo_and_video_comment, photo_and_video, photo_and_video_type) VALUES ('${req.params.id}', '${req.body.comments[index]}', '${item.filename}', '${item.mimetype}')`;

		conn.query(sql, err => {
			if(err) throw err;
		});
	});
	res.json({success:true});
}
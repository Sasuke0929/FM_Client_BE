import {conn} from '../config';
import crypto from 'crypto';
import jwt from 'jwt-simple';

import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

import {JWT_SECRET_KEY} from '../config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anton.david0017@gmail.com',
        pass: 'wdsqnmnkglvkgfbd'
    }
});

const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};

export const EmailVerification = (req, res, next) => {
	const email = req.body.email;
    const confirmCode = Math.floor(1000 + Math.random() * 9000);

    readHTMLFile(__dirname + '/../index.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = { usercode: confirmCode };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'anton.david0017@gmail.com',
            to: email,
            subject: 'Verify Email',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
            	console.log(info);
                return res.status(500).json({
                    status: '500',
                    msg: error
                });
            } else {
            	console.log(info);
                return res.status(200).json({
                    status: '200',
                    msg: 'sent code.',
                    code: confirmCode
                });
            }
        });                              
    });                              
}

const generatedToken = user => {
	return jwt.encode({token: user, expire: Date.now() + (1000 * 60 * 60), sub: user.id}, JWT_SECRET_KEY);
}

const HashPassword = password => {
	return crypto.createHash('sha256').update(password).digest('hex');
}

export const login = (req, res, next) => {
	const sql = `select * from users where email = '${req.body.detail.email}' limit 1`;
	conn.query(sql, (err, user) => {
		if(user.length){
			if(user[0].password !== HashPassword(req.body.detail.password)){
				res.send({success: false, msg: 'Wrong password'});
			}else{
				const token = generatedToken(user);
				return res.status(200).json({success: true, token: token});
			}
		}else{
			res.send({success: false, msg: 'Email no existed'});
		}
	});
}

export const register = (req, res, next) => {
	const sql = `select * from users where email = '${req.body.details.email}'`;
	conn.query(sql, (err, user) => {
		if(user.length){
			res.json({success: false, msg:'already existed!!'});
		}else{
			const sql1 = `INSERT INTO users (firstname, middlename, surname, placeofbirth, dateofbirth, dateofpassing, email, mobilenumber, password, isown, isverified) VALUES ('${req.body.details.firstname}', '${req.body.details.middlename}', '${req.body.details.surname}', '${req.body.details.placeofbirth}', '${req.body.details.dateofbirth}', '${req.body.details.dateofpassing}', '${req.body.details.email}', '${req.body.details.mobilenumber}', '${HashPassword(req.body.details.password)}', ${req.body.details.isowner}, true)`;

			conn.query(sql1, (err, user) => {
				if(err) throw err;

				res.json({success: true, newuser: user});
			})
		}
	});
}

export const GetMyProfile = (req, res, next) => {
	const sql = `select * from users where id = ${req.params.id} limit 1`;

	conn.query(sql, (err, response) => {
		res.json(response[0]);
	});
}

export const uploadsong = (req, res, next) => {
	const sql = `UPDATE users SET profilesong = '${req.file.filename}', profile_uploaded_song_type = '${req.file.mimetype}' WHERE email = '${req.params.email}'`;

	conn.query(sql, function(err, docs){
		if(err) throw err;

		docs.profilesong = req.file.filename;
		docs.profile_uploaded_song_type = req.file.mimetype;
		res.json(docs);
	});
}

export const uploadimage = (req, res, next) => {
	const sql = `UPDATE users SET profileimg = '${req.file.filename}', profile_uploaded_image_type = '${req.file.mimetype}' WHERE email = '${req.params.email}'`;

	conn.query(sql, function(err, docs){
		if(err) throw err;

		docs.profileimg = req.file.filename;
		docs.profile_uploaded_image_type = req.file.mimetype;
		res.json(docs);
	});
}

export const GetMyObituary = (req, res, next) => {
	const sql = `select * from obituarys where id = ${req.params.id} limit 1`;

	conn.query(sql, (err, response) => {
		res.json(response[0]);
	});
}
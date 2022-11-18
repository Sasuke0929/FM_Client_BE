import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

import {conn} from '../config';

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

export const sendEmail = (req, res, next) => {
    readHTMLFile(__dirname + '/../contact_us.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = { useremail: req.body.email, usermessage: req.body.message, emailtitle: req.body.subject, memorial_name: req.body.memorial_name };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: req.body.email,
            to: 'anton.david0017@gmail.com',
            subject: 'Verify Email',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({
                    status: '500',
                    msg: error
                });
            } else {
                const sql = `INSERT INTO contact_us (memorial_name, fromMail, MailSubject, message) VALUES ('${req.body.memorial_name}', '${req.body.email}', '${req.body.subject}', '${req.body.message}')`;

                conn.query(sql, (err, response) => {
                    if (err) throw err;

                    res.json({success: true});
                });
            }
        });                              
    });
}
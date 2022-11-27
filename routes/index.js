import express from 'express';

import * as upload from '../middleware/upload';

import * as user from '../controllers/Users';
import * as payment from '../controllers/payControllers';
import * as timeline from '../controllers/TimelineControllers';
import * as photo_video from '../controllers/photovideoControllers';
import * as contact_us from '../controllers/ContactUsControllers';
import * as comments from '../controllers/CommentControllers';
import * as forever from '../controllers/ForeverControllers';

const router = express.Router();

/-------------------------------  User Info Management --------------------------------/

router.post('/login', user.login);
router.post('/register', user.register);
router.post('/emailverify', user.EmailVerification);
router.get('/getprofile/:id', user.GetMyProfile);
router.post('/uploadsong/:email', upload.upload.single('file'), user.uploadsong);
router.post('/uploadimage/:email', upload.upload.single('file'), user.uploadimage);

/-------------------------------  User Obituary Management --------------------------------/

router.get('/getmyobituary/:id', user.GetMyObituary);

/-------------------------------  User Timeline Management --------------------------------/

router.get('/gettimeline_content/:id/:year', timeline.gettimeline_content);
router.post('/uploadevent/:id', timeline.uploadevent);
router.post('/uploadeventimage/:year/:month', upload.upload.single('file'), timeline.uploadeventimage);

/-------------------------------  User Photo_and_Video Management --------------------------------/

router.get('/getmyphotoes/:id', photo_video.getmyphotoes);
router.post('/uploadmydata/:id', upload.upload.fields([{ name: 'file' , maxCount:10}]), photo_video.uploadmydata);

/-------------------------------  User Payment Management --------------------------------/

router.post('/create-payment-intent', payment.addon_payment);

/-------------------------------  Contact_Us Management --------------------------------/

router.post('/contact_us', contact_us.sendEmail);

/-------------------------------  User Comments Management --------------------------------/

router.get('/getcomments/:id', comments.getcomments);
router.post('/leavecomment/:id', comments.leavecomment);

/-------------------------------  Send ForeverMessage Management --------------------------------/

router.get('/getfmmessage/:email/', forever.getfmmessage);
router.post('/savemessage/:email/:mobilenumber', upload.upload.single('file'), forever.savemessage);

module.exports = router;
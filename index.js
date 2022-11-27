import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Router from './routes';
import { SERVER_URI, SERVER_PORT, conn } from './config';

const app = express();

app.use(express.urlencoded({extended:false}));
app.use('/api/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());
app.use(Router);

app.listen(SERVER_PORT, () => console.log(`Server running at ${SERVER_URI}:${SERVER_PORT}`));

// MySQL Connection
// conn.connect(function (err) {
//     if (err) throw err;
//     console.log('MySQL Connected');
// });

// MongoDB connecting
// mongoose.connect(`mongodb://${MONGODB_URI}:${MONGODB_PORT}/${MONGODB_NAME}`, {
//    useNewUrlParser: true,
//    useFindAndMidify: false,
//    useUnifiedTopology: true
// }, () => {
//    console.log(`MongoDB connected at ${MONGODB_URI}:${MONGODB_PORT}`);
// });
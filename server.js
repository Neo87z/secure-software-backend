const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const https = require('http')
const fs = require('fs')
const path = require("path");
const bodyParser = require('body-parser');
const UseController = require('./controllers/userController');
const RoomController = require('./controllers/roomController');
const morgan = require('morgan');
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 8089;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error) => {
    if (error) {
        console.log('Database Error: ', error.message);
    }
});
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
mongoose.connection.once('open', () => {
    console.log('Database Connection Sucessfull');
});

app.use('/user', UseController());
app.use('/auth', RoomController());
const options = {
    key: fs.readFileSync(path.join(__dirname, "./cert/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "./cert/cert.pem")),
};

const server = https.createServer(options, app).listen(8089, () => {
    console.log("server running at " + 5000);
});


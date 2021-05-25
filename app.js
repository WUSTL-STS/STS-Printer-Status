const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/.env'});

const app = express();

app.use(cors());
app.use(express.json());

//TODO: Move DB connection to different file
let uri = process.env.PROD_URI;
if(process.env.NODE_ENV == 'dev'){
    uri = process.env.M_URI;
}

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("Connected to MongoDB");
});

app.use('/', require('./routes/index'))

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server hosted on port ${port}`);
});

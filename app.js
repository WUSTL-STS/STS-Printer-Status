const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/.env'});

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.M_URI

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

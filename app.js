const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express(); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database connected');
});

// set views file
app.set('views', path.join(__dirname, 'views'));

// set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



app.get('/', (req, res) => {
    //res.send('CRUD Operation using NodeJS / ExpressJS/ MySql');
    res.render('user_index');
})

// Server listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

// Optional for nodemon : nodemon app (OR) npm start

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
    let sql = "SELECT * FROM employees";
    let query =  connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('employees', {
            title: 'CRUD Operations using NodeJS, ExpressJS, MySQL',
            employees: rows
        });
    });
});

app.get('/addEmployee', (req, res) => {
    // res.send('new employee form page');
    res.render('add_employee', {
        title: 'Adding an employee'
    });
});

app.post('/save', (req, res) => {
    let data = {tip_ust: req.body.tip_ust, vu_identifikator: req.body.vu_identifikator, zap_redni_broj: req.body.employee_id_number, 
                zap_ime: req.body.employee_name, zap_srednje_slovo: req.body.employee_initials, zap_prezime: req.body.employee_surname};
    let sql = "INSERT INTO employees SET ?"
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:zap_redni_broj', (req, res) => {
    const zap_redni_broj = req.params.zap_redni_broj;
    let sql = `SELECT * FROM employees WHERE zap_redni_broj = ${zap_redni_broj}`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('edit_employees', {
            title : 'Edditing an employee',
            employees : result[0]
        });
    });
});

// Server listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});




// Optional for nodemon : nodemon app (OR) npm start

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

    let allTypesOfInstitution = [];
    let allHEI = [];

    getAllTypesOfInstitutions().then(data1 => {
        allTypesOfInstitution = data1;
    });

    getAllHighEducationInstitutions().then(data2 => {
        allHEI = data2;
    });
    
    let query1 = 'SELECT * FROM TYPES_OF_INSTITUTIONS';
    let query2 = 'SELECT * FROM HIGH_EDUCATION_INSTITUTION;'
    connection.query((query1, (err, data1) => {
        connection.query((query2, (err, data2) => {
            // res.send('new employee form page');
            res.render('add_employee', {
                title: 'Adding an employee',
                types_of_institutions : allTypesOfInstitution,
                high_education_institutions : allHEI
                });
        }));
    }));
});

app.get('/typesOfInstitutions', (req, res) => {
    var tip_ust = req.body.tip_ust;
    let sql = "SELECT * FROM types_of_institutions";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw (err);
        res.render('types_of_institutions', {
            title: 'Adding a type of institution',
            types_of_institutions: rows
        });
    });
});

app.get('/addTypeOfInstitution', (req, res) => {
    res.render('add_type_of_institution', {
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

app.get('/editEmployees/:zap_redni_broj', (req, res) => {
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

app.post('/updateEmployees', (req, res) => {
    const zap_redni_broj = req.body.zap_redni_broj;
    let sql = "UPDATE employees SET TIP_UST = '" + req.body.tip_ust + "' , VU_IDENTIFIKATOR = '" + req.body.vu_identifikator + "' , ZAP_REDNI_BROJ = '" 
              + req.body.zap_redni_broj + "' , ZAP_PREZIME = '" + req.body.zap_prezime + "' , ZAP_SREDNJE_SLOVO = '" + req.body.zap_srednje_slovo + 
              "' , ZAP_IME = '" + req.body.zap_ime + "' WHERE ZAP_REDNI_BROJ =  " + zap_redni_broj; 
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});


app.get('/deleteEmployees/:zap_redni_broj', (req, res) => {
    const zap_redni_broj = req.params.zap_redni_broj;
    let sql = `DELETE FROM employees WHERE zap_redni_broj = ${zap_redni_broj}`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw (err);
        res.redirect('/');
    });
});

// Server listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});



function getAllTypesOfInstitutions() {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM TYPES_OF_INSTITUTIONS;"
        connection.query(query, (err, data1) => {
            if (!err) {
                resolve(data1);
            }
            else {
                reject(err);
            }
        });
    });
};

function getAllHighEducationInstitutions() {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM HIGH_EDUCATION_INSTITUTION;"
        connection.query(query, (err, data2) => {
            if (!err) {
                resolve(data2);
            }
            else {
                reject(err);
            }
        })
    })
}


// Optional for nodemon : nodemon app (OR) npm start

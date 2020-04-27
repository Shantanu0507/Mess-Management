const express = require('express')
const bodyParser = require('body-parser') 
const {Pool} = require('pg')
const bcrypt = require('bcrypt')

const {addStudent,addStudentDetails,getStudentById,getStudentDetails, getStudentByEmail, getManagerByEmail, getManagerScreen} = require('./utils/queries')

const managers = require('./data/manager.json')
const students = require('./data/student.json')
const monthly_details = require('./data/monthlydetails.json')
const mess = require('./data/mess.json')


const app = express()
const ejs = require('ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const db = new Pool({
    user: "postgres",
    password: "sql@123",
    host: "localhost",
    port: 5432,
    database: 'messManagement'
})

app.get('/', async (req, res) => {
    let id = req.query.id
    console.log(id)
    home(id,res)
})

app.get('/manager', (req, res) => {
    
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signUp', (req, res) => {
    res.render('sign_up')
})

app.get('/loginAsManager', (req, res) => {
    res.render('loginAsManager')
})


app.post('/loginAsManager', async (req, res) => {
    var manager = {
        mobile_no: req.body.mobile_no,
        password:req.body.password
    }
    try {     
        let result = await db.query(getManagerByEmail(manager.mobile_no))
        let isCorrect = await bcrypt.compare(manager.password, result.rows[0].password)
      if(isCorrect) {
        goToManager(result.rows[0],res)
      }
    } catch (err) {
        console.log('err', err)
    }
})


app.post('/login',async (req, res) => {
    var student = {
        email: req.body.email,
        password:req.body.password
    }
    try {     
    let result = await db.query(getStudentByEmail(student.email))
   let isCorrect = await bcrypt.compare(student.password, result.rows[0].password)
    if(isCorrect) {
        res.redirect('/?id=' + result.rows[0].id)
    }
    } catch (error) {
        console.log('error', error)  
    }
})


app.post('/signUp', async function(req, res)  {
    var student = {
        email: req.body.email, 
        name:req.body.name,
        password:await bcrypt.hash(req.body.password, 10),
        department:req.body.department,
        year:req.body.year,
        registration_id: req.body.registration_id,
        mobile_no: req.body.mobile_no,
        father_mobile_no: req.body.father_mobile_no,
        mess_name: 'C Mess',
        mess_id: 1
    }
    try {

        let response = await db.query(addStudent(student))
        console.log(response.rows)
    let result =  await db.query(addStudentDetails(student,response.rows[0].id))
    let resp = await db.query(getStudentByEmail(student.email))
    let isCorrect = await bcrypt.compare(student.password, resp.rows[0].password)
     if(isCorrect) {
         res.redirect('/?id=' + resp.rows[0].id)
     }
    } catch (error) {
        console.log('error', error)
    }
  


})

app.get('/createTable', async (req, res) => {
    // let managersTable = `create table managers (
    //     manager_id BIGSERIAL NOT NULL PRIMARY KEY,
    //     mess_name Text NOT NULL,
    //     manager_name TEXT NOT NULL,
    //     manager_contact TEXT NOT NULL,
    //     password TEXT NOT NULL
    // )`
    // await db.query(managersTable)

    // let messTable = `create table mess (
    //     mess_id BIGSERIAL NOT NULL PRIMARY KEY,
    //     manager_id BIGSERIAL REFERENCES managers(manager_id),
    //     mess_name Text NOT NULL,
    //     manager_name TEXT NOT NULL
    // )`
    // await db.query(messTable)


    // let studentsTable = `create table students(
    //     id TEXT NOT NULL PRIMARY KEY,
    //     name TEXT,
    //     department TEXT,
    //     year TEXT,
    //     parents_contact TEXT,
    //     email TEXT NOT NULL,
    //     password TEXT NOT NULL,
    //     mess_name TEXT,
    //     mess_id BIGSERIAL REFERENCES mess(mess_id)
    // )`
    // await db.query(studentsTable)


    let monthly_table = `create table monthly_details (
        id TEXT REFERENCES students (id) ,
        mess_id BIGSERIAL REFERENCES mess(mess_id),
        name TEXT,
        month_name TEXT,
        start_balance INT,
        end_balance INT,
        monthly_total INT,
        total_meals INT,
        veg_meals INT,
        non_veg_meals INT,
        leaves INT
    )`
    await db.query(monthly_table)

})


app.get('/putData', (req, res) => {
    // students.forEach(async student => {
    //     student.name = student.name + student.last_name
    //     delete student.last_name
    //     student.password = await bcrypt.hash(student.password, 10);
    //     let query = {
    //         text: "INSERT INTO students VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    //         values: [student.id, student.name, student.department, student.year, student.parents_contact, student.email, student.password, student.mess_name, student.mess_id]
    //     }

    //     await db.query(query)
    // })

    // managers.forEach(async manager => {
    //     manager.password =  await bcrypt.hash(manager.password, 10);
    //     let query = {
    //         text: "INSERT INTO managers VALUES($1, $2, $3, $4, $5)",
    //         values: [manager.manager_id, manager.mess_name, manager.manager_name, manager.manager_contact, manager.password]
    //     }

    //     await db.query(query)
    // })

//     monthly_details.forEach(async stud => {
//         stud.name = stud.name + ' ' + stud.last_name
//         delete stud.last_name
//         stud.start_balance = parseInt(stud.start_balance)
//         stud.end_balance = parseInt(stud.end_balance)
//         stud.monthly_total = parseInt(stud.monthly_total)
//         stud.total_meals = parseInt(stud.total_meals)
//         stud.veg_meals = parseInt(stud.veg_meals)
//         stud.non_veg_meals = parseInt(stud.non_veg_meals)
//         stud.leaves = parseInt(stud.leaves)

//         let query = {
//             text: "INSERT INTO monthly_details VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
//             values: [stud.id, stud.mess_id, stud.name,stud.month_name, stud.start_balance, stud.end_balance, stud.monthly_total, stud.total_meals, stud.veg_meals, stud.non_veg_meals,stud.leaves]
//         }
// try {
//     await db.query(query)
    
// } catch (error) {
//   console.log(error)  
// }
    // })

    // mess.forEach(async m => {
    //     let query = {
    //         text: "INSERT INTO mess VALUES($1, $2, $3, $4)",
    //         values: [m.mess_id, m.manager_id,m.mess_name,m.manager_name]
    //     }

    //     await db.query(query) 
    // })

    console.log(monthly_details)
})


app.listen(9000, () => console.log('Server started on port 9000'))


const home = async (id, res) => {
    try {
        
        let response =  await db.query (getStudentById(id))
        let student = response.rows[0]
        if(response.rowCount  == 0) {
            student = null
        }
        console.log(student)
    
      res.render('home', {student})
    } catch (err) {
        console.log(err)
    }

}



const goToManager = async (manager,res)=> {
    let response = await db.query(getManagerScreen(manager.manager_id))
    let data = response.rows
    let total =0
    data.map(d=> {
        total = total + d.monthly_total
    })
    console.log(total)
    res.render('manager',{ data: data, manager: manager.manager_name, total:total})
}
const {Pool } = require('pg')


exports.getStudentByEmail = (email) => {
    return query = {
        text: 'SELECT * FROM students WHERE email = $1',
        values:[email]
    };
}


exports.signUp =(email, password) => {
    return query = {
        text: 'INSERT INTO students VALUES ($1)',
        values:[email, password]
    };
}

exports.getStudentMessDetails = (student_id) => {
    return query = {
        text: 'SELECT * FROM mess_data WHERE student_id = $1',
        values:[student_id]
    }
}

exports.addStudent = (student) => {
    return query = {
        text: 'INSERT INTO students(mess_name,mess_id,email,password, registration_id)  VALUES($1, $2, $3, $4, $5) RETURNING id ',
        values:[student.mess_name, student.mess_id, student.email, student.password, student.registration_id]
    }
}

exports.addStudentDetails = (student, id) => {
    return query = {
        text: 'INSERT INTO student_details(id,mess_id,name, department, year, mobile_no, fathers_mobile_no) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        values:[id, student.mess_id, student.name, student.department, student.year, student.mobile_no, student.father_mobile_no]
    }
}

exports.getStudent = () => {
    return query = {
        text: "SELECT * FROM students"
    }
}

exports.getManagerByEmail = (mobile_no) => {
    return query = {
        text: 'SELECT * FROM managers WHERE manager_contact = $1',
        values:[mobile_no]
    };
}

exports.getManagerScreen = (manager_id) => {
    return query = {
        text: 'SELECT * FROM monthly_details where mess_id = (SELECT mess_id FROM mess where manager_id = $1)',
        values:[manager_id]
    }
}

exports.getStudentDetails = (email) => {
    return query = {
        text: 'SELECT * FROM students INNER JOIN monthly_details ON students.id = monthly_details.id WHERE email = $1',
        values:[email]
    }
}

exports.getStudentById = (id) => {
    return query = {
        text: 'SELECT * FROM students INNER JOIN monthly_details ON students.id = monthly_details.id WHERE students.id = $1',
        values:[id]
    }
}
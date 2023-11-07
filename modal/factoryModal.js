const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const departmentSchema = new mongoose.Schema({
    departmentName :{
        type : String
    },
    employeeName :{
        type : String
    },
    manager :{
        type : String
    },
    action :{
        type : String
    }
})

const shiftSchema = new mongoose.Schema({
    date :{
        type : String
    },
    startTime :{
        type : String
    },
    endTime :{
        type : String
    },
    employees :{
        type : String
    }
})

const employeeSchema = new mongoose.Schema({
    name :{
        type : String
    },
    lastName :{

        type : String
    },
    startYear :{
        type : String
    },
    departmentOf :{
        type : String
    },
    shiftTime :{
        type : String
    }
})


const registerUser = new mongoose.Schema({
    name:{
        type : String
    },
    contact:{
        type : Number
    },
    email:{
        type : String
    },
    password:{
        type : String
    }
})

registerUser.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirm_password = await bcrypt.hash(this.password, 12);
    }
    next();
})


const employee = mongoose.model('employee',employeeSchema)
const shift = mongoose.model('shift',shiftSchema)
const department = mongoose.model('department',departmentSchema)
const register = mongoose.model('register',registerUser)

module.exports = {department,shift,employee,register}
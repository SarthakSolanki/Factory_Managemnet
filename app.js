const express = require('express')
const http = require('http')
const path = require('path')
const fs = require('fs')
const app  = express()
const alert = require('alert')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const {employee, department,shift,register} = require('./modal/factoryModal')
const port = process.env.PORT || 3000
require('./conn')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))

app.get('/register',async(req,res)=>{
    res.render('register',{})
})

app.get('/login',async(req,res)=>{
    res.render('login',{})
})
app.get('/dashboard',async(req,res)=>{
    res.render('dashboard',{})
})

app.get('/shift',async(req,res)=>{
    const data = await shift.find()
    res.render('shift',{data:data})
})

app.get('/department',async(req,res)=>{
    const data = await department.find()
    res.render('department',{data:data})
})

app.get('/employee',async(req,res)=>{
    const data = await employee.find()
    res.render('employee',{data: data})
    
})

app.get('/addEmployee',async(req,res)=>{
    const data = await department.find()  
    res.render('addEmployee',{data:data})
})

app.get('/addShift',async(req,res)=>{
    try {
        res.render('addShift')
    } catch (error) {
        console.log(error)
    }
})

app.get('/editShift/:id',async(req,res)=>{
    try {
        const shiftInfo = await shift.findById(req.params.id)
        res.render('editShift',{data:shiftInfo})
    } catch (error) {
        console.log(error)
    }
})

app.get('/editemp/:id', async(req,res)=>{
    try {
        const item = await department.find()  
        const data = await employee.findById(req.params.id)
        res.render('editemp', { data:data , item:item})
    } catch (error) {
        console.log(error)
    }
})

app.get('/addDepartment',async(req,res)=>{
    res.render('addDepartment',{})
})

app.get('/editDepartment/:id',async(req,res)=>{
    try {
        const departmentInfo = await department.findById(req.params.id)
        res.render('editDepartment',{ data:departmentInfo })
    } catch (error) {
        console.log(error)
    }
})

app.get('/delete-employee/:id',async(req,res)=>{
    employee.deleteOne({ _id: req.params.id })
    .then(result => {
    })
    .catch(error => {
      console.error(error);
    });
    res.redirect("/employee");
})

app.get('/delete-department/:id',async(req,res)=>{
    department.deleteOne({_id: req.params.id})
    .then(result =>{
        res.redirect('/department')
    })
    .catch(error=>{
        console.log(error)
    })
})

app.get('/delete-shift/:id',async(req,res)=>{
    shift.deleteOne({_id: req.params.id})
    .then(result =>{
        res.redirect('/shift')
    })
    .catch(error=>{
        console.log(error)
    })
})

app.post('/register',async(req,res)=>{
    const {name,contact,email,password} = req.body
    try {
        const data = new register({name,contact,email, password})
        await data.save()
        res.redirect('/login')
    } catch (error) {
        console.log(error)
    }
})

app.post('/login',async(req,res)=>{
    const { email, password } = req.body
    if (!email || !password) {
       return alert("Username and Password are required")
    }
    try {
      const user = await register.findOne({ email: email })
      if (!user) {
        return alert("User not found")
      }
      const isMatch = await bcrypt.compare(password, user.password)
      console.log(password)
      console.log(user.password)
      if (!isMatch) {
          return alert("Invalid Password")
      } else {
        res.redirect('/dashboard')
      }
    } catch (error) {
      console.log(error)
      res.status(400)
    }
})

app.post('/addEmployee',async(req,res)=>{
    const {name,lastName,startYear,departmentOf,shiftTime} = req.body
    try {
        const data = new employee({ name,lastName,startYear,departmentOf,shiftTime });
        await data.save();
        res.redirect('/employee');
    } catch (error) {
        console.log(error)
    }

})

app.post('/addDepartment',async(req,res)=>{
    const{departmentName,employeeName,manager} = req.body
    try {
        const data = new department({departmentName,employeeName,manager})
        await data.save()
        res.redirect('/department')
    } catch (error) {
        console.log(error)
    }
})

app.post('/editemp/:id', async (req, res) => {
    try {
      const data = await employee.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/employee');
    } catch (error) {
      console.log(error);
    }
  });

app.post('/editDepartment/:id',async(req,res)=>{
    try {
        const data = await department.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/department')
    } catch (error) {
        console.log(error)
    }
})

app.post('/editShift/:id',async(req,res)=>{
    try {
        const shiftInfo = await shift.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/shift')
    } catch (error) {
        console.log(error)
    }
})

app.post('/addShift',async(req,res)=>{
    const {date,startTime,endTime,employees} = req.body
    try {
        const data = new shift({date,startTime,endTime,employees}) 
        await data.save()
        res.redirect('/shift')
    } catch (error) {
        console.log(error)
    }
})

app.listen(3000,()=>{
    console.log("Server started a port 3000")
})

// fs.readFile('./public/add-department.html',function(error,html){
//     if(error){
//      throw error
//     }
//     http.createServer(function(req,res){
//         res.writeHeader(200,{"Content-Type" : "text/html"})
//         res.write(html)
//         res.end()
//     }).listen(port)
// })








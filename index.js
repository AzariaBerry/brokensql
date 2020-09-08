//THIS FILE NEEDS TO BE FINISHED Y'ALL

var express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser")
const PORT = process.env.PORT || 5079;

var app = express();
const { check, validationResult } = require("express-validator");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'store',
    password : ''
  });


  app.get("/", (req, res) => {
    res.render("index");
});


  
app.post("/register",[
  check("name")
  //removes the space to check if name is empty
  .trim()
  //name shall not be null or empty
  .notEmpty().withMessage("name is required, although Noname is pretty cool")
  //if err, kick the user to fix it
  .bail()
  //makes sure entry matches the acceptable format and characters
  .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("name should start with a letter and can only include letters with spaces, hyphens, apostrophies and the latin alphabet.")
  //if err, kick the user out to fix it
  .bail()
  //checks to see if matches the length of database column
  .isLength({min:2, max:15}).withMessage("Please enter your first name or last name between 2 and 15 characters."),
  check("username")
  //its the same as name except numbers are allowed yayy
  .trim()
  //username cant be empty its when you pick something cool
  .notEmpty().withMessage("username is required, here is where you can use a cool name")
  //if err, kick the user to fix it
  .bail()
  //makes sure the entry follow the accepted characters
  //also helps prevent SQL injection (cough cough Morgan)
  .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ0-9 '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("Username should start with a letter, and can only contain letters with spaces, numbers, hyphens, apostrophes and the latin alphabet.")
  .bail()
  .isLength({min:3, max:18}).withMessage("Please enter a cool username between 3 and 18 characters, numbers may be included."),
  check("email")
  //removes whitespaces, there are no spaces in emails
  .trim()
  //a empty email is no email at all
  .notEmpty().withMessage("Email is required")
  //if err, get that outta here and fix it
  .bail()
  //lets check to make sure nothing thats not accepted gets into the database
  .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,'g').withMessage("Email may contain letter, numbers, and must end with @domainname.com")
  //if err, get the user to safety and fix it
  .bail()
  //match the length of the database column
  .isLength({min:12, max:50}).withMessage("Please enter a email address between 12 and 50 characters.")

], 
(req, res) => {  
  // Check our results
  let result = validationResult(req);
  // Stuff them in an object
  let errors = result.errors;  
  // Show me the errors in the console
  for (let key in errors) {
      console.log(errors[key].value);
  }
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    
  if (!result.isEmpty()){
    //if error, alert
    res.render("index", { errors, name, username, email })
  }
  else {
    //if no errors, add to the database
    let insert = "insert into customers(??, ??, ??) values (?, ?, ?)";
    connection.query(insert, [name, username, email,"name", "username", "email"], (err,results)=> {
      //if doesnt work, get big mad
      if (err) {
        console.log(err);
    }
    let success = `awwwww yeahhhh!`
    res.render("index", { success, name, username, email });
    });
  }
});
//connection.query('select * from customers', function (error, results, fields) {
  //if (error) throw error;
  //console.log('The solution is: ', results);
//});


app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})
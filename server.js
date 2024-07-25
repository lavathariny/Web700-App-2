/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Lavatharini Jasinthakumar Student ID: 153494232 Date: July 25, 2024
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var express = require("express");
var path = require("path");
var exphbs = require('express-handlebars');
var collegeData = require("./modules/collegeData");
var app = express();

// Custom Handlebars helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
        navLink: function(url, options) {
            return '<li class="nav-item' + ((url == app.locals.activeRoute) ? ' active' : '') + '">' +
                '<a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

// Configure Handlebars
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for setting active route
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    console.log("Active route:", app.locals.activeRoute);
    next();
});

// GET route to return the home.hbs file
app.get("/", (req, res) => {
    res.render('home');
});

// GET route to return the about.hbs file
app.get("/about", (req, res) => {
    res.render('about');
});

// GET route to return the htmlDemo.hbs file
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

// GET route to return all students or students by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.render('students', { students: data });
        }).catch((err) => {
            res.render('students', { message: "no results" });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.render('students', { students: data });
        }).catch((err) => {
            res.render('students', { message: "no results" });
        });
    }
});

// GET route to return all TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs().then((data) => {
        res.render('tas', { tas: data });
    }).catch((err) => {
        res.render('tas', { message: "no results" });
    });
});

// GET route to return all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render('courses', { courses: data });
    }).catch((err) => {
        res.render('courses', { message: "no results" });
    });
});

// GET route to return a student by student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((data) => {
        res.render('student', { student: data });
    }).catch((err) => {
        res.render('student', { message: "no results" });
    });
});

// GET route to return addStudent.hbs
app.get("/students/add", (req, res) => {
    res.render('addStudent');
});

// POST route to handle form submission for adding a student
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
       .then(() => {
            res.redirect("/students"); // Redirect to the student listing page
        })
       .catch((err) => {
            console.error("Error adding student:", err);
            res.sendStatus(500); // Internal server error 
        });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Initialize the data and start the server
collegeData.initialize().then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });    
}).catch((err) => {
    console.error("Unable to start server:", err.message);
});

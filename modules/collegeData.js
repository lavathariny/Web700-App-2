const fs = require('fs');

let students = [];
let courses = [];

// Initialize the data from JSON files
module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read students.json file");
                return;
            }
            students = JSON.parse(data);

            fs.readFile('./data/courses.json', 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read courses.json file");
                    return;
                }
                courses = JSON.parse(data);
                resolve();
            });
        });
    });
};

// Get all students
module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject("No students found");
        } else {
            resolve(students);
        }
    });
};

// Get students by course
module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = students.filter(student => student.course == course);
        if (filteredStudents.length === 0) {
            reject("No students found for the specified course");
        } else {
            resolve(filteredStudents);
        }
    });
};

// Get student by student number
module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
        const student = students.find(student => student.studentNum == num);
        if (student) {
            resolve(student);
        } else {
            reject("Student not found");
        }
    });
};

// Add a new student
module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        studentData.studentNum = students.length + 1;
        students.push(studentData);
        resolve();
    });
};

// Update an existing student
module.exports.updateStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        let index = students.findIndex(student => student.studentNum == studentData.studentNum);
        if (index !== -1) {
            // Handle the TA checkbox data
            studentData.TA = studentData.TA === "on";
            students[index] = studentData;
            resolve();
        } else {
            reject("Student not found");
        }
    });
};

// Get all courses
module.exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        if (courses.length === 0) {
            reject("No courses found");
        } else {
            resolve(courses);
        }
    });
};

// Get course by course ID
module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        let course = courses.find(course => course.courseId == id);
        if (course) {
            resolve(course);
        } else {
            reject("query returned 0 results");
        }
    });
};

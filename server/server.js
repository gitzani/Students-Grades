const express = require('express');
const app = express();
const port = process.env.PORT || process.argv[2] || 8080;
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const dataPath = "./data.json";
const fs = require('fs');

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:8080"],
  })
);
app.use(express.json());


if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}
let students = JSON.parse(fs.readFileSync(dataPath));



app.get('/api/v1/students', cors(), (req, res) => {
  res.json(students);
  console.log(students);
});

app.post('/api/v1/students', cors(), (req, res) => {
  const { name, program, grade, id } = req.body;

  if (id) {
    return res.status(400).json({ message: 'Use update to update student' });
  } else {
    const newStudent = { id: uuidv4(), name, program, grade };
    students.push(newStudent);
    fs.writeFileSync(dataPath, JSON.stringify(students));
    return res.json(newStudent);
  }
});

app.delete('/api/v1/students/:id', cors(), (req, res) => {
  const id = req.params.id;
  const deletedStudent = students.find((student) => student.id === id);
  students = students.filter((student) => student.id !== id);
  fs.writeFileSync(dataPath, JSON.stringify(students));
  res.json(deletedStudent);
});

app.put('/api/v1/students/:id', cors(), (req, res) => {
  const id = req.params.id;
  const { name, program, grade } = req.body;
  const updatedStudent = students.find((student) => student.id === id);
  updatedStudent.name = name;
  updatedStudent.program = program;
  updatedStudent.grade = grade;
  fs.writeFileSync(dataPath, JSON.stringify(students));
  res.json(updatedStudent);
});

app.listen(port, () => console.log(`Listening on ${port}`));

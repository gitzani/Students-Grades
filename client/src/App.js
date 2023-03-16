import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentGrade, setSelectedStudentGrade] = useState("");
  const [selectedStudentProgram, setSelectedStudentProgram] = useState("");

  const clearFormFields = () => {
    setSelectedStudentName("");
    setSelectedStudentProgram("");
    setSelectedStudentGrade("");
    setSelectedStudentId(null);
  };

  const formRef = useRef();

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/students");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    const id = selectedStudentId
    const name = formRef.current.elements.name.value;
    const program = formRef.current.elements.program.value;
    const grade = formRef.current.elements.grade.value;

    const newStudent = {
      id,
      name,
      program,
      grade,
    };
    clearFormFields();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/students",
        newStudent
      );
      setStudents([...students, response.data]);
      clearFormFields(); // Call the clearFormFields() function to reset the form fields
      formRef.current.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const selectStudent = (id) => {
    setSelectedStudentId(id);
    const selectedStudent = students.find((student) => student.id === id);
    setSelectedStudentName(selectedStudent.name);
    setSelectedStudentGrade(selectedStudent.grade);
    setSelectedStudentProgram(selectedStudent.program);
  };

  const editStudent = async (e) => {
    e.preventDefault();

    const name = formRef.current.elements.name.value;
    const program = formRef.current.elements.program.value;
    const grade = formRef.current.elements.grade.value;

    const updatedStudent = {
      id: selectedStudentId,
      name,
      program,
      grade,
    };
    try {
      await axios.put(
        `http://localhost:8080/api/v1/students/${selectedStudentId}`,
        updatedStudent
      );
      const newStudents = students.map((student) => {
        if (student.id === selectedStudentId) {
          return updatedStudent;
        }
        return student;
      });
      setStudents(newStudents);
      setSelectedStudentId(null); // Reset selected student ID
      clearFormFields(); // Call the clearFormFields() function to reset the form fields
      formRef.current.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/students/${selectedStudentId}`
      );

      setStudents(students.filter((student) => student.id !== id));
      // FEATURE let the forms keep the selected student ID so if by mistake it can be reposted
      // clearFormFields(); // Call the clearFormFields() function to reset the form fields
      // formRef.current.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const renderedStudents = students.map((student) => (
    <li
      key={student.id}
      className={`list-group-item ${
        selectedStudentId === student.id ? "selected" : ""
      }`}
      // className={`list-group-item ${
      //   selectedStudentId === student.id ? "active" : ""
      // }`}
      onClick={() => selectStudent(student.id)}
    >
      <div className="student-grouped">
        <div className="student-name">{`${student.name}`}</div>
        <div>{` ${student.program}, ${student.grade}`}</div>
      </div>
      <div className="button-grouped"></div>
    </li>
  ));

  return (
    <div className="container">
      <h1 className="text-center">Student Grades</h1>
      <div className="row">
        <div className="col-second">
          <h2>Students</h2>
          <ul className="list-group">{renderedStudents}</ul>
        </div>

        <div className="col-first">
          <h2>Add Student</h2>
          <form className="form" onSubmit={addStudent} ref={formRef}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Student Name"
                value={`${selectedStudentName || ""}`}
                className="form-control"
                onChange={(e) => setSelectedStudentName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="program">Program</label>
              <input
                type="text"
                id="program"
                placeholder="Enter Program"
                value={`${selectedStudentProgram || ""}`}
                className="form-control"
                onChange={(e) => setSelectedStudentProgram(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Grade</label>
              <input
                type="text"
                id="grade"
                placeholder="Enter Grade"
                value={`${selectedStudentGrade || ""}`}
                className="form-control"
                onChange={(e) => setSelectedStudentGrade(e.target.value)}
              />
            </div>
            <button className="btn btn-primary-submit">Submit</button>
            {selectedStudentId && (
              <button className="btn btn-primary-update" onClick={editStudent}>
                Update
              </button>
            )}{" "}
            {selectedStudentId && (
              <button
                className="btn btn-primary-update"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  deleteStudent(selectedStudentId);
                }}
              >
                Delete
              </button>
            )}{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

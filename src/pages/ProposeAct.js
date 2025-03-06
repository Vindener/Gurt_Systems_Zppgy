import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Paper } from "@mui/material";
import styled from "@emotion/styled";

const FormContainer = styled(Paper)`
  max-width: 600px;
  margin: auto;
  padding: 24px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  width: 100%;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #115293;
  }
`;

const ProposeAct = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Помилка завантаження студентів:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.pib.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("student_id", selectedStudent);
    formData.append("date", date);
    formData.append("reason", reason);
    if (file) formData.append("file", file);

    try {
      const response = await fetch("/api/propose-act", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message);
      setSelectedStudent("");
      setDate("");
      setReason("");
      setFile(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Помилка надсилання акту:", error);
      setMessage("Помилка під час відправки");
    }
  };

  return (
    <Container>
      <FormContainer>
        <Typography variant="h5" gutterBottom>
          Запропонувати акт
        </Typography>
        {message && <Typography color="green">{message}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Пошук студента"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Студент"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            margin="normal"
          >
            <MenuItem value="" disabled>Оберіть студента</MenuItem>
            {filteredStudents.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.pib} ({student.group})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Дата порушення"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Опис порушення"
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            margin="normal"
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <StyledButton type="submit" variant="contained">
            Запропонувати акт
          </StyledButton>
        </form>
      </FormContainer>
    </Container>
  );
};

export default ProposeAct;

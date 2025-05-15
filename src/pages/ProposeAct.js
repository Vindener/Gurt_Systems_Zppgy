import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import styled from "@emotion/styled";

const FormContainer = styled(Paper)`
  max-width: 600px;
  margin: auto;
  margin-top: 12px;
  padding: 24px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  background-color: #1976d2;
  color: white;
  margin-top: 18px;
  &:hover {
    background-color: #115293;
  }
`;

const FileInput = styled("input")`
  display: none;
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
  const [error, setError] = useState("");
  const API = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API}/api/students`);
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Помилка завантаження студентів:", error);
        setError(
          "Не вдалося завантажити список студентів. Можливо проблема з сервером."
        );
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
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("student_id", selectedStudent);
    formData.append("date", date);
    formData.append("reason", reason);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(`${API}/api/propose-act`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Помилка під час відправки.");
      }
      setMessage("Акт успішно надіслано!");
      setSelectedStudent("");
      setDate("");
      setReason("");
      setFile(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Помилка надсилання акту:", error);
      setError(error.message);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Typography variant="h5" gutterBottom>
          Запропонувати акт
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
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
            <MenuItem value="" disabled>
              Оберіть студента
            </MenuItem>
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
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#1976d2", color: "white" }}
            >
              {file ? `Файл: ${file.name}` : "Додати файл"}
            </Button>
          </label>

          <FileInput
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <StyledButton type="submit" variant="contained">
            Запропонувати акт
          </StyledButton>
        </form>
      </FormContainer>
    </Container>
  );
};

export default ProposeAct;

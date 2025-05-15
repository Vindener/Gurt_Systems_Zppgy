import React, { useState, useEffect } from "react";
import {
  auth,
  signInWithGoogle,
  logout,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "./firebase";
import ProposeAct from "./pages/ProposeAct";
import {
  Container,
  Button,
  Typography,
  Paper,
  TextField,
  Alert,
} from "@mui/material";
import styled from "@emotion/styled";

const AppContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  max-width: 500px;
  background-color: #fafafa;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #115293;
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(getFriendlyErrorMessage(error.code));
    }
  };

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Невірний формат email.";
      case "auth/user-not-found":
        return "Користувач не знайдений. Перевірте email або зареєструйтесь.";
      case "auth/wrong-password":
        return "Невірний пароль. Спробуйте ще раз.";
      case "auth/email-already-in-use":
        return "Цей email вже використовується.";
      case "auth/weak-password":
        return "Пароль занадто короткий. Мінімум 6 символів.";
      default:
        return "Помилка авторизації. Перевірте введені дані.";
    }
  };

  return (
    <AppContainer>
      <StyledPaper>
        {user ? (
          <>
            <Typography variant="h5">Вітаємо, {user.email}!</Typography>
            <StyledButton variant="contained" onClick={logout}>
              Вийти
            </StyledButton>
            <ProposeAct />
          </>
        ) : (
          <>
            <Typography variant="h5" style={{ marginBottom: "12px" }}>
              Будь ласка, увійдіть
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              style={{ display: "flex", justifyContent: "center", gap: "20px" }}
            >
              <StyledButton variant="contained" onClick={handleSignIn}>
                Увійти
              </StyledButton>

              <StyledButton variant="contained" onClick={signInWithGoogle}>
                Увійти через Google
              </StyledButton>
            </div>
          </>
        )}
      </StyledPaper>
    </AppContainer>
  );
}

export default App;

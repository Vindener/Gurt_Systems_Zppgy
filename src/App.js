import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout, onAuthStateChanged } from "./firebase";
import ProposeAct from "./pages/ProposeAct";
import { Container, Button, Typography, Paper } from "@mui/material";
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
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppContainer>
      <StyledPaper>
        {user ? (
          <>
            <Typography variant="h5">Вітаємо, {user.displayName}!</Typography>
            <StyledButton variant="contained" onClick={logout}>
              Вийти
            </StyledButton>
            <ProposeAct />
          </>
        ) : (
          <>
            <Typography variant="h5">Будь ласка, увійдіть</Typography>
            <StyledButton variant="contained" onClick={signInWithGoogle}>
              Увійти через Google
            </StyledButton>
          </>
        )}
      </StyledPaper>
    </AppContainer>
  );
}

export default App;
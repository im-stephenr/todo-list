import {
  Alert,
  AlertTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { login, loginError } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Call backend
    login(loginData);
  };

  const handleInput = (e) => {
    setIsSubmitted(false);
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  return (
    <>
      {loginError && loginError.isError && (
        <Alert
          severity="warning"
          sx={{ marginBottom: "10px;" }}
          onClose={() => {
            setIsRegistrationSuccess(false);
          }}
        >
          <AlertTitle>WARNING</AlertTitle>
          {loginError.message}
        </Alert>
      )}
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          error={isSubmitted && loginData.username === ""}
          fullWidth
          margin="normal"
          id="username"
          label="Username"
          type="text"
          onInput={handleInput}
          required
          helperText={
            isSubmitted && loginData.username === "" && "Please Enter Username"
          }
        />
        <TextField
          error={isSubmitted && loginData.password === ""}
          fullWidth
          margin="normal"
          id="password"
          label="Password"
          type="password"
          onInput={handleInput}
          required
          helperText={
            isSubmitted && loginData.password === "" && "Please Enter Password"
          }
        />
        <Button type="submit" variant="contained" endIcon={<AccessibleIcon />}>
          Submit
        </Button>
      </Box>
    </>
  );
}

import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import { useRegister } from "../../hooks/useRegister";

export default function Register() {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
  });
  const { register, isRegistrationSuccess } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send data to Backend
    register(registerData);
  };

  const handleInput = (e) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };
  return (
    <>
      {isRegistrationSuccess && (
        <Alert
          severity="success"
          sx={{ marginBottom: "10px;" }}
          onClose={() => {
            setIsRegistrationSuccess(false);
          }}
        >
          <AlertTitle>Success</AlertTitle>
          User added — <strong>Successfully!</strong>
        </Alert>
      )}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          onInput={handleInput}
          margin="normal"
          id="fullName"
          label="Full Name"
          type="text"
        />
        <TextField
          fullWidth
          margin="normal"
          id="username"
          label="Username"
          type="text"
          onInput={handleInput}
        />
        <TextField
          fullWidth
          margin="normal"
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onInput={handleInput}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<AccessibleForwardIcon />}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}

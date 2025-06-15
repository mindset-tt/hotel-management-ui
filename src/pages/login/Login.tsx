import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import Grid from "@mui/material/Grid";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (values: any) => {
    console.log("Form submitted with values:", values);
    navigate("/rooms");
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.username) {
      errors.username = "ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້";
    }
    if (!values.password) {
      errors.password = "ກະລຸນາໃສ່ລະຫັດຜ່ານ";
    }
    return errors;
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      //   sx={{ background: "#F3F7FF" }}
    >
      <Form onSubmit={onSubmit} validate={validate}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                width: 400,
                background: "transparent",
                borderRadius: 2,
                p: 4,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                color="#49bb58"
                mb={4}
                sx={{ textAlign: "left" }}
              >
                Login
              </Typography>
              <Typography fontWeight={500} mb={1} color="#222">
                User Name
              </Typography>
              <Field name="username">
                {({ input, meta }) => (
                  <>
                    <TextField
                      {...input}
                      fullWidth
                      variant="outlined"
                      placeholder="User Name"
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "#fff",
                        },
                      }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  </>
                )}
              </Field>
              <Typography fontWeight={500} mb={1} color="#222">
                Password
              </Typography>
              <Field name="password">
                {({ input, meta }) => (
                  <>
                    <TextField
                      {...input}
                      fullWidth
                      variant="outlined"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      sx={{
                        mb: 2,
                        // background: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "#fff",
                        },
                      }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((show) => !show)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              </Field>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: "#49bb58",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 20,
                  borderRadius: 2,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": { background: "#5db369" },
                }}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </form>
        )}
      </Form>
    </Box>
  );
};

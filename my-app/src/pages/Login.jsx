//react some react and formik stuff
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

//material mui apis
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { makeStyles } from "@mui/styles";

//icons and api for password field from mui
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//styled components to style component
import styled from "styled-components";

//some firebase functions and modules from firebase.js
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";

//local imports
import { theme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../context/AuthContext";
import { array } from "yup/lib/locale";
// imports are finished --------------------------------------------------------------------------------------

//styling our Link Api
const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: #0a639e;
  }
`;

//to change color of formik Error message's helperText
const useStyles = makeStyles((theme) => ({
  textField: {
    "& p": {
      color: "red",
    },
  },
}));

//preventing default of eye icon
const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

//Login Component
const Login = (props) => {
  const [err, setErr] = useState(false);

  const classes = useStyles();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  //initial values of our form
  const initialValues = {
    email: "",
    password: "",
    showPassword: false,
  };

  //  TODO: Check if email exists------------------------------------------
  // const validationSchema = Yup.object({
  //   email: Yup.string().email("Invalid email").required("Required"),
  //   password: Yup.string().min(6, "Too Short!").required("Required"),
  // });
  //--------------------------------------------------------------------------

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async (values, { setSubmitting }) => {
        const email = values.email;
        const password = values.password;

        setSubmitting(false);
        setTimeout(setLoading(true), 5000)

        try {

          //FOR SOME REASONS, 
          setPersistence(auth, browserSessionPersistence)
            .then(async () => {
              return signInWithEmailAndPassword(auth, email, password).then(
                async (res) => {
                  navigate("/");
                  await updateDoc(doc(db, "users", res.user.uid), {
                    isOnline: true,
                  });
                }
              );
            })
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              setErr(true);
            });
        } catch (error) {
          setLoading(false)
          setErr(true);
         
        }
      }}
      // validationSchema={validationSchema}
    >
      {(props) => {
        const {
          values,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        //input fields and divs of sign up Component
        return (
          <div className="formContainer">
            <div className="formWrapper">
              <span className="logo">ChatterScript</span>
              <span className="title">Login</span>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  type="text"
                  name="email"
                  label="Email"
                  helperText={<ErrorMessage name="email" />}
                  autoComplete="off"
                  classes={{ root: classes.textField }}
                  InputLabelProps={{
                    sx: {
                      color: "#0a689e",
                      [`&.${inputLabelClasses.shrink}`]: {
                        color: " #3692cf",
                      },
                    },
                  }}
                />
                <TextField
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  type={values.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  helperText={<ErrorMessage name="password" />}
                  autoComplete="off"
                  classes={{ root: classes.textField }}
                  sx={{
                    marginTop: "20px",
                    input: {
                      "&::placeholder": {
                        color: "#0a639e",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ThemeProvider theme={theme}>
                          <LockIcon
                            sx={{
                              color: (theme) => theme.palette.iconLock.main,
                            }}
                          />
                        </ThemeProvider>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setFieldValue("showPassword", !values.showPassword);
                          }}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <ThemeProvider theme={theme}>
                  <Button
                    fullwidth
                    sx={{ marginTop: "20px" }}
                    variant="contained"
                    type="submit"
                  >
                    Login
                  </Button>
                </ThemeProvider>

                {/* {loading && err ? (
                  <Typography>Login into ChatterScript...</Typography>
                ):   <Typography></Typography>} */}

                {err && (
                  <Typography sx={{ color: "red" }}>No User Found</Typography>
                )}
              </form>

              <Stack
                spacing={2}
                direction="row"
                sx={{ marginTop: "20px", justifyContent: "space-evenly" }}
              >
                <Typography variant="body2" gutterBottom>
                  Forgot password?
                </Typography>
                <StyledLink {...props} to="/reset-password">
                  <Typography variant="body2" gutterBottom>
                    reset
                  </Typography>
                </StyledLink>
              </Stack>

              <Stack
                spacing={2}
                direction="row"
                sx={{ marginTop: "20px", justifyContent: "space-evenly" }}
              >
                <Typography variant="h6" gutterBottom>
                  Not signed up yet?
                </Typography>
                <StyledLink {...props} to="/signup">
                  <Typography variant="h6" gutterBottom>
                    Sign Up
                  </Typography>
                </StyledLink>
              </Stack>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};
export default Login;

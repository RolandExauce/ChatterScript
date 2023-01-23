//react some react
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//some formik and yup stuff
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

//material mui apis
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { makeStyles } from "@mui/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

//styled components to style component
import styled from "styled-components";

//some firebase functions and modules from firebase.js
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

//local imports
import { theme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import notUploaded from "../img/x_notDone.svg";
import Uploaded from "../img/check_Done.svg";
import { Avatar } from "@mui/material";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  SEKRET_KEY_NOTE_SAFE,
  SEKRET_KEY,
} from "../keys";
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

//to change color of formik Error message
const useStyles = makeStyles((theme) => ({
  textField: {
    "& p": {
      color: "red",
    },
  },
}));

//SignUp Component
const SignUp = (props) => {
  const { setSignedUp } = useContext(AuthContext);
  //not uploaded at the beginning
  const [imageUri, setImageUri] = useState(notUploaded);

  //style from useStyles constant
  const classes = useStyles();

  const navigate = useNavigate();

  //useState when creating user and error
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  //initial values of our form
  const initialValues = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
    secretKey: "",
  };

  // Yup Validation schema ------------------------------------------
  //TODO: later use regex to validate password better, Verify email
  // const SEKRET = process.env.REACT_APP_SEKRET_KEY;
  //const SEKRET = SEKRET_KEY
  const SEKRET = SEKRET_KEY_NOTE_SAFE


  // console.log(process.env);
  const validationSchema = Yup.object({
    displayName: Yup.string()
      .min(3, "atleast 3 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    // password: Yup.string()
    //   .matches(regex)
    //   .min(6, "Too Short!")
    //   .required("Required"),

    password: Yup.string().min(6, "Too Short!").required("Required"),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    file: Yup.mixed().required("Upload a Profile Picture"),
    secretKey: Yup.string()
      .required("Provide the Secret Key")
      .test(
        "correct",
        "Incorrect Secret Key",

        // #TODO: Remove this later
        // async (value) => (await value) === SEKRET
        async (value) => (await value) ===  SEKRET
       
      ),
  });
  //--------------------------------------------------------------------------

  return (
    <Formik
      // formik onsubmit handled with props
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setTimeout(() => {
          //console.log(values)
          setSubmitting(false);
        }, 500);

        //------------------------------------------------------------------
        setLoading(true);
        const displayName = values.displayName;
        const email = values.email;
        const password = values.password;
        const file = values.file;

        try {
          //Create user
          const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          //listen for Sign Up
          if (res !== null) {
            setSignedUp(true);
          }

          //Create a unique image name
          const date = new Date().getTime();
          const storageRef = ref(storage, `profiles/${displayName + date}`);

          //profile picture
          await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              try {
                //Update profiles
                await updateProfile(res.user, {
                  displayName,
                  photoURL: downloadURL,
                });

                //create users collection on firestore
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                  isOnline: true,
                });

                //create empty user chats on firestore
                await setDoc(doc(db, "userChats", res.user.uid), {});
              } catch (err) {
                setErr(true);
                setLoading(false);
              }
            });
          });
          // signOut(auth);
          navigate("/signup-success");
        } catch (err) {
          setErr(true);
          setLoading(false);
        }
        //--------------------------------------------------------------------
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        //input fields and divs of sign up Component
        return (
          <div className="formContainer">
            <div className="formWrapper">
              <span className="logo">Sign Up</span>

              <form onSubmit={handleSubmit}>
                <TextField
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.displayName}
                  type="text"
                  name="displayName"
                  label="Username"
                  helperText={<ErrorMessage name="displayName" />}
                  autoComplete="off"
                  classes={{ root: classes.textField }}
                  InputLabelProps={{
                    sx: {
                      // set the color of the label when not shrinked
                      color: "#0a689e",
                      [`&.${inputLabelClasses.shrink}`]: {
                        // set the color of the label when shrinked (usually when the TextField is focused)
                        color: " #3692cf",
                      },
                    },
                  }}
                />
                <TextField
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  type="email"
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
                  type="password"
                  name="password"
                  label="Password"
                  helperText={<ErrorMessage name="password" />}
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
                  value={values.confirmPassword}
                  type="password"
                  name="confirmPassword"
                  label="Confirm password"
                  helperText={<ErrorMessage name="confirmPassword" />}
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
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    marginTop: "10px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="text"
                    sx={{
                      fontWeight: "bold",
                      fontFamil: "arial",
                      color: "#0a639e",
                      width: "28ch",
                    }}
                    component="label"
                  >
                    <CloudUploadIcon sx={{ marginRight: "15px" }} />
                    Upload Avatar
                    <input
                      type="file"
                      id="file"
                      name="file"
                      hidden
                      onChange={(e) => {
                        setFieldValue("file", e.currentTarget.files[0]) &&
                          setImageUri(Uploaded);
                      }}
                    />
                  </Button>
                  <Avatar
                    src={imageUri}
                    style={{
                      height: "20px",
                      width: "20px",
                      margin: "0.4rem 1rem 0rem 0rem",
                    }}
                  />
                </Stack>

                {touched.file && errors.file && (
                  <p style={{ color: "red" }}>{errors.file}</p>
                )}

                <TextField
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.secretKey}
                  type="password"
                  name="secretKey"
                  label="Authorization Key"
                  helperText={<ErrorMessage name="secretKey" />}
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
                  sx={{ marginTop: "10px" }}
                />

                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    margin: "10px 40px 0px 0px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <Button
                      sx={{ width: "15ch" }}
                      variant="contained"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </ThemeProvider>

                  <ThemeProvider theme={theme}>
                    <Button
                      sx={{ width: "10ch" }}
                      onClick={handleReset}
                      variant="contained"
                    >
                      Reset
                    </Button>
                  </ThemeProvider>
                </Stack>

                {loading && "Creating user in Firebase..."}
              </form>

              <Stack
                spacing={2}
                direction="row"
                sx={{ marginTop: "20px", justifyContent: "space-evenly" }}
              >
                <Typography variant="h6" gutterBottom>
                  Already have an Account?
                </Typography>
                <StyledLink {...props} to="/login">
                  <Typography variant="h6" gutterBottom>
                    Login
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
export default SignUp;

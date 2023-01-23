//react some react and formik stuff
import React from "react";
import { Link } from "react-router-dom";

//material mui apis
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./assets/scss/reset.scss"

//styled components to style component
import styled from "styled-components";

//local imports
import { theme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";



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

const ResetPassword = (props) => {
  const handleSubmit = async (value) => {
    console.log(value);
  };

  return (
    <div className="formContainer">
      <div className="formWrapperReset">
        <span className="title">Forgot Password</span>

        <form onSubmit={handleSubmit}>
          <TextField
          fullWidth
            variant="standard"
            type="email"
            name="email"
            label="Enter your Email"
            autoComplete="off"
          />

          <ThemeProvider theme={theme}>
            <Button
              fullwidth
              sx={{ marginTop: "20px" }}
              variant="contained"
              type="submit"
            >
              Send Reset Link
            </Button>
          </ThemeProvider>
        </form>

        <StyledLink {...props} to="/login">
          <Typography variant="body1" gutterBottom>
            Back to Login
          </Typography>
        </StyledLink>
      </div>
    </div>
  );
};

export default ResetPassword;

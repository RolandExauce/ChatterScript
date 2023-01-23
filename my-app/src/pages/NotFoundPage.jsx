import React from "react";
import { useNavigate } from "react-router-dom";
import errorPage from "../img/errorPage.png";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="formContainer"
      style={{
        backgroundColor: "#fff",
        display: "column",
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <img
        alt="Not found"
        src={errorPage}
        sx={{
          width: "100%",
          height: "100%",
        }}
      />

      <ThemeProvider theme={theme}>
        <Button
          onClick={() => {
            navigate("/login");
          }}
          variant="contained"
          sx={{
            marginLeft: "15px",
          }}
        >
          Go back to Login
        </Button>
      </ThemeProvider>
    </div>
  );
};
export default NotFoundPage;

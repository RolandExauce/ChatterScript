//react some react
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NotFound from "../pages/NotFoundPage";

//material mui apis
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";

//firebase
import { signOut } from "firebase/auth";

//local imports
import SuccessImg from "../img/success.png";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
// imports are finished --------------------------------------------------------------------------------------

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const theme = createTheme({
  typography: {
    fontSize: 12,
    fontFamily: "arial",
  },
});

//On Success SignUp
const SuccessSignUp = (props) => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const { signedUp } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      isOnline: false,
    });

    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="formContainer">
      {signedUp ? (
        <div className="formWrapper">
          <Typography variant="h3" className="logo">
            Registration complete !
          </Typography>
          <img src={SuccessImg} style={{ width: "300px", height: "300px" }} />

          <Stack
            spacing={2}
            direction="row"
            sx={{ marginTop: "20px", justifyContent: "space-evenly" }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: "25px",
              }}
              onClick={handleSignout}
            >
              <ThemeProvider theme={theme}>
                <Typography variant="h6" gutterBottom>
                  Continue to login
                </Typography>
              </ThemeProvider>
            </Button>
          </Stack>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};
export default SuccessSignUp;

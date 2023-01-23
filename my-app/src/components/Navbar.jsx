import * as React from "react";
import { useState, useContext } from "react";

//material ui components
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//local imports
import { theme } from "../theme";
import { AuthContext } from "../context/AuthContext";

//firebae
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
//--------------------------------------------------------------------------------------------

//styling BootStrap Dialog pop-up window
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

//navbar component
export default function Navbar() {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const initialValues = {
    displayName: currentUser.displayName,
    email: currentUser.email,
    password: "",
    photoURL: currentUser.photoURL,
    ReadOnly: true,
  };

  const [values, setValues] = useState(initialValues);
  const [open, setOpen] = useState(false);
  //-------------------------------------------------

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };




  //TODO: HANDLE POP UP DIALOG FORM VALUES
  const handleSubmit = async (e) => {
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    //console.log("This is the DPN", displayName);
  };
  //-------------------------------------------------

  return (
    <div className="navbar">
      <span className="logo">ChatterScript</span>

      <Button
        variant="text"
        sx={{ color: "white", fontFamily: "verdana" }}
        onClick={handleClickOpen}
      >
        Profile
      </Button>

 
      <ThemeProvider theme={theme}>
        <Button
          color="secondary"
          size="small"
          variant="contained"
          sx={{
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white",
            fontFamily: "Arial",
            fontSize: "10px",
            width: "13ch",
            height: "5ch",
            margin: "5px",
            "&:hover": {
              background: "#fff",
              color: "#165eaf",
            },
          }}
          onClick={handleSignout}
        >
          logout
        </Button>
      </ThemeProvider>
      <Button variant="standard" sx={{ justifyContent: "flex-end" }}>
        <MoreVertIcon sx={{ justifyContent: "flex-end" }} />
      </Button>

      <form onSubmit={handleSubmit}>
        <BootstrapDialog open={open} onClose={handleClose}>
          <DialogTitle
            sx={{
              fontFamily: "verdana",
              fontSize: "40px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#01579b",
            }}
          >
            Profile
          </DialogTitle>

          <Box position="absolute" top={0} right={0}>
            <IconButton>
              <CloseIcon sx={{ color: "#fff" }} onClick={handleClose} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              borderRadius: 1,
              bgcolor: "background.paper",
              color: "text.secondary",
              "& svg": {
                m: 0.5,
              },
              "& hr": {
                m: 0.5,
              },
              margin: "20px",
            }}
          >
            <DialogContent>
              <Avatar
                sx={{
                  width: "160px",
                  height: "170px",
                  borderRadius: "50%",
                  backgroundColor: "#000",
                }}
                src={values.photoURL}
                alt="image"
              />
            </DialogContent>

            <DialogContent>

{ !values.ReadOnly && (<Typography sx={{color: "red"}} > You can now edit your information! </Typography>) }
              
              <Stack
                spacing={2}
                direction="column"
                sx={{
                  justifyContent: "space-evenly",
                  margin: "20px 20px 40px 20px",
                }}
              >
                <TextField
                  type="text"
                  name="displayName"
                  onChange={(e) => {
                    setValues((previous) => ({
                      ...previous,
                      displayName: e.target.value,
                    }));
                  }}
                  value={values.displayName}
                  placeholder="username"
                  variant="outlined"
                  inputProps={{
                    readOnly: Boolean(values.ReadOnly),
                    disabled: Boolean(values.ReadOnly),
                  }}
                  sx={{ width: "23ch" }}
                />

                <TextField
                  type="email"
                  name="email"
                  onChange={(e) => {
                    setValues((previous) => ({
                      ...previous,
                      email: e.target.value,
                    }));
                  }}
                  value={values.email}
                  placeholder="email"
                  variant="outlined"
                  inputProps={{
                    readOnly: Boolean(values.ReadOnly),
                    disabled: Boolean(values.ReadOnly),
                  }}
                  sx={{ width: "23ch" }}
                />

                <TextField
                  type="password"
                  name="password"
                  onChange={(e) => {
                    setValues((previous) => ({
                      ...previous,
                      password: e.target.value,
                    }));
                  }}
                  value={values.password}
                  placeholder="new password"
                  variant="outlined"
                  inputProps={{
                    readOnly: Boolean(values.ReadOnly),
                    disabled: Boolean(values.ReadOnly),
                  }}
                  sx={{ width: "23ch" }}
                />
              </Stack>
            </DialogContent>
          </Box>

          <DialogActions>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  margin: "10px",

                  backgroundColor: (theme) => theme.palette.deleteButtons.main,
                  color: "#fff",
                }}
              >
                Delete Account
              </Button>
            </ThemeProvider>

            <Button
              variant="contained"
              sx={{ margin: "10px", width: "12ch" }}
              onClick={() =>
                setValues((previous) => ({
                  ...previous,
                  ReadOnly: !values.ReadOnly,
                }))
              }
            >
              {values.ReadOnly ? (
                <>
                  <ModeEditIcon sx={{ marginRight: "10px" }} />
                  <Typography>Edit</Typography>
                </>
              ) : (
                <Typography>Save</Typography>
              )}
            </Button>

            {/* <Button variant="contained" type="submit" sx={{ margin: "10px" }}>
              Save changes
            </Button>
             */}
          </DialogActions>
        </BootstrapDialog>
      </form>
    </div>
  );
}

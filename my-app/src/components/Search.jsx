//react stuff and local stuff
import React from "react";
import { useState, useContext, useEffect } from "react";
import { theme } from "../theme";

//mui stuff
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";

//firebase stuff and config files
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
//...................................

//Search Component
const Search = () => {
  //useStates variables
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [err, setErr] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch, setStart, start } = useContext(ChatContext);

  //search user by fullName, later implementation of ID Search for the first time
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      console.log("No data found");
      setNotFound(true);
      setUser(null);
    } else if (!(docs.docs.length === 0)) {
      console.log(docs);

      try {
        const querySnapshot = await getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              if (doc.data().displayName === currentUser.displayName) {
                setUser(null);
                setNotFound(true);
              } else {
                setUser(doc.data());
                setNotFound(false);
              }
            }
          });
        });
      } catch (err) {
        setErr(true);
      }
    }
  };

  //Search by letters
  const searchByLetter = () => {
    Object.entries(chats)
      .map((chat) => chat[1].userInfo.displayName)
      .map(async (user) => {
        const partOfUsername = user
          .toLowerCase()
          .includes(username.toLowerCase());

        if (partOfUsername) {
          setNotFound(false);
          const q = query(
            collection(db, "users"),
            where("displayName", "==", user)
          );
          try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              setUser(doc.data());
              setNotFound(false);
            });
          } catch (error) {
            setErr(true);
          }
        } else if (partOfUsername == false) {
          setNotFound(true);
          setUser(null);
        }
      });
  };

  //If enter is pressed
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch() && searchByLetter();
  };

  //for close icon
  const handleDelete = () => {
    setUsername("");
    setUser(null);
    setNotFound(false);
  };

  // fetch user chats
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  //handle Selected user
  const handleSelect = async (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setStart(true);

    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(
          doc(db, "userChats", currentUser.uid),

          {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          }
        );

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }

    //reset values
    setUser(null);
    setUsername("");
    setNotFound(false);
  };

  return (
    <div className="search">
      <Grid className="searchForm">
        <ThemeProvider theme={theme}>
          <TextField
            autoComplete="off"
            placeholder="Find a user to chat"
            variant="outlined"
            inputProps={{ maxLength: 24 }}
            // listen to keyboard action
            onKeyDown={handleKey}
            onChange={(e) => {
              setUsername(e.target.value);

              if (!e.target.value) {
                handleDelete();
              }
            }}
            value={username}
            sx={{
              margin: "12px",
              "& fieldset": {
                borderRadius: "30px",
              },

              "& .MuiInputBase-input": {
                color: "rgb(10, 10, 10)",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  {username ? (
                    <ThemeProvider theme={theme}>
                      <Button onClick={handleDelete}>
                        <ArrowBackIcon
                          sx={{ color: (theme) => theme.palette.primary.main }}
                        />
                      </Button>
                    </ThemeProvider>
                  ) : (
                    <ThemeProvider theme={theme}>
                      <Button>
                        <SearchIcon
                          sx={{ color: (theme) => theme.palette.primary.main }}
                        />
                      </Button>
                    </ThemeProvider>
                  )}
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment>
                  {username ? (
                    <ThemeProvider theme={theme}>
                      <Button onClick={handleDelete}>
                        <CloseIcon
                          sx={{ color: (theme) => theme.palette.primary.main }}
                        />
                      </Button>
                    </ThemeProvider>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
        </ThemeProvider>

        <ThemeProvider theme={theme}>
          <Button>
            <GroupAddIcon
              sx={{
                width: "45px",
                height: "45px",
                color: (theme) => theme.palette.primary.main,
              }}
            />
          </Button>
        </ThemeProvider>
      </Grid>
      <Typography
        variant="body2"
        sx={{
          color: "red",
          alignContent: "right",
          display: "flex",
          margin: "0px 0px 10px 30px",
        }}
      >
        {notFound ? "No User found " : " "}
      </Typography>
      {user ? (
        <Stack
          direction="row"
          spacing={2}
          className="userChat"
          onClick={() => {
            handleSelect(user);
          }}
          sx={{ backgroundColor: "#d0e7fde3" }}
        >
          <Avatar
            src={user.photoURL}
            sx={{
              marginLeft: "20px",
              width: "80px",
              height: "80px",
              border: "2px solid #01579b",
            }}
          />
          <div className="userChatInfo">
            <Typography variant="h6">{user.displayName}</Typography>
          </div>
        </Stack>
      ) : null}
    </div>
  );
};
export default Search;

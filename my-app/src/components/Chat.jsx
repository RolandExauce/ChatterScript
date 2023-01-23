//react stuff
import React from "react";
import { useContext, useEffect, useState } from "react";

//mui imports
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VideocamIcon from "@mui/icons-material/Videocam";
import Avatar from "@mui/material/Avatar";
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";

//local imports
import { theme } from "../theme";
import Messages from "./Messages";
import Input from "./Input";
import Welcome from "./welcomeSection/Welcome";

import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { start } = useContext(ChatContext);
  const [offline, setOffline] = useState(true);
  // const [isTyping, setIsTyping] = useState(false);
  // const [hour, setHour] = useState(addZero(d.getHours()))
  // const [min, setMin] = useState(d.getMinutes())

  // const addZero = (i) => {
  //   if (i < 10) {
  //     i = "0" + i;
  //   }
  //   return i;
  // };

  // const d = new Date();
  // const h = addZero(d.getHours());
  // const m = addZero(d.getMinutes());
  // const time = hour + ":" + min;

  //Get the current online status and keep track of it
  useEffect(() => {
    const dbRef = collection(db, "users");
    const getStatus = () => {
      const unsub = onSnapshot(dbRef, (docsSnap) => {
        docsSnap.forEach((doc) => {
          if (
            doc.data().displayName === data.user?.displayName &&
            doc.data().isOnline === true
          ) {
            setOffline(false);
          } else if (
            doc.data().displayName === data.user?.displayName &&
            doc.data().isOnline === false
          ) {
            setOffline(true);
          }
        });
      });

      return () => {
        unsub();
      };
    };
    data?.user.uid && getStatus();
  }, [data?.user.uid]);

  return start ? (
    <div className="chat">
      <div className="chatInfo">
        <Stack
          spacing={2}
          direction="row"
          sx={{
            marginLeft: "15px",
          }}
        >
          <Avatar
            src={data.user?.photoURL}
            sx={{ width: "55px", height: "55px" }}
          />

          <Stack spacing={2} direction="column">
            <Typography style={{ display: "flex" }} variant="h6">
              {data.user?.displayName}
            </Typography>

            <Typography
              style={{
                alignSelf: "center",
                display: "flex",
                margin: "0px 0px 0px 0px",
              }}
              variant="body2"
            >
              {offline ? "offline" : "online"}
            </Typography>
          </Stack>
        </Stack>

        <div className="chatIcons">
          <ThemeProvider theme={theme}>
            <Button size="small" variant="standard">
              <VideocamIcon />
            </Button>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Button size="small" variant="standard">
              <CallIcon />
            </Button>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Button size="small" variant="standard">
              <MoreHorizIcon />
            </Button>
          </ThemeProvider>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  ) : (
    <div
      className="chat"
      style={{
        backgroundColor: "#F2F1F0",
      }}
    >
      <Welcome />
     
    </div>
  );
};
export default Chat;

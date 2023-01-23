import * as React from "react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const StyledBadge = styled(Badge)(({ theme }, ...props) => ({
  "& .MuiBadge-badge": {
    // backgroundColor: "#44b700",
    backgroundColor: props.badgeColor ?? "#44b700",

    color: "#44b700",

    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,

    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  border: `2px solid ${theme.palette.info.dark}`,
}));

const 
Chats = () => {
  const lastMessageMaxChar = 20;
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { data, setStart } = useContext(ChatContext);
  const { messageId } = useContext(ChatContext);
  const [you, setYou] = useState(true);
  const [fromYou, setFromYou ] = useState("")

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        //current user id
        // const userId = Object.entries(doc.data())[0][1].userInfo;
        // const lastMsg = Object.entries(doc.data())[0][1].lastMessage.text;

        // if (messageId === currentUser.uid) {
        //   setYou(true);
        //   setFromYou("you")
        // } else {
        //   setYou(false);
        //   setFromYou("")
        // }
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    setStart(true);
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <Stack
            direction="row"
            spacing={2}
            className="userChat"
            key={chat[0]}
            onClick={() => {
              handleSelect(chat[1].userInfo);
            }}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              colour="red"
            >
              <SmallAvatar
                alt="user image"
                src={chat[1].userInfo.photoURL}
                sx={{
                  marginLeft: "20px",
                  width: "60px",
                  height: "60px",
                }}
              />
            </StyledBadge>

            <div className="userChatInfo">
              <Typography variant="h6">
                {chat[1].userInfo.displayName}
              </Typography>

              {chat[1].lastMessage ? (
                <Typography variant="body2" sx={{ color: "#2273ed" }}>
                  { 
                    chat[1].lastMessage?.text.slice(0, lastMessageMaxChar) +
                    (chat[1].lastMessage?.text.length > lastMessageMaxChar
                      ? "..."
                      : "")}
                </Typography>
              ) : (
                <Typography variant="body2"></Typography>
              )}
            </div>
          </Stack>
        ))}
    </div>
  );
};
export default Chats;

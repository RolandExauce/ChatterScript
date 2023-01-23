import React, { useContext, useRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";

//local imports
import { AuthContext } from "../context/AuthContext";
import pdf_Icon from "../img/PDF_icon.png";
import { theme } from "../theme";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const scrollRef = useRef();
  const { currentUser } = useContext(AuthContext);
  const { messageId, setMessageId } = useContext(ChatContext);

  useEffect(() => {
    setMessageId(message.senderId);
    console.log(messageId);
  }, [currentUser.uid]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageContent">
        {message.text ? <p variant="body2"> {message.text} </p> : null}
        {message.imageFile && <img src={message.imageFile} />}

        {message.pdf && (
          <div
            className={`pdfMessage ${
              message.senderId === currentUser.uid && "pdfOwner"
            }`}
          >
            <ThemeProvider theme={theme}>
              <Button
                style={{
                  borderRadius: "10px",
                  width: "22ch",
                  height: "6ch",
                  color: "#fff",
                }}
                variant="contained"
                color="pdfButton"
                onClick={() => {
                  window.open(message.pdf);
                }}
              >
                <img
                  src={pdf_Icon}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    marginRight: "10px",
                  }}
                />
                <h3>Open PDF</h3>
              </Button>
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  );
};
export default Message;

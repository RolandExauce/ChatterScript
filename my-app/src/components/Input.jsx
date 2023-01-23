import React, { useState, useContext } from "react";
//MUI imports
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
//local imports
import { theme } from "../theme";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, storage } from "../firebase";

//Some firebase stuff
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

//v4
import { v4 as uuid } from "uuid";

const Input = () => {
  const [err, setErr] = useState(false);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { isPdf, setIsPdf, setTyping } = useContext(ChatContext);

  //------------------------------------------------------
  const handleKeySend = async (e) => {
    (e.code === "Enter" || e.code === "enter") && handleSend();
  };

  const handleSend = async () => {
    if (selectedFile && !isPdf) {
      const storageRef = ref(storage, `images/${uuid()}`);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        (err) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                imageFile: downloadURL,
              }),
            });
          });
        }
      );
    } else if (selectedFile && isPdf) {
      const storageRef = ref(storage, `pdf_files/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        (err) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                pdf: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setSelectedFile(null);
  };

  //------------------------------------------------------
  return (
    <div className="input">
      <ThemeProvider theme={theme}>
        <Button size="small" variant="standard">
          <InsertEmoticonIcon
            color="primary"
            sx={{ width: "35px", height: "35px" }}
          />
        </Button>
      </ThemeProvider>

      <TextField
        fullWidth
        placeholder="Type a message ..."
        type="text"
        autoComplete="off"
        sx={{
          overflow: "auto hidden",
          border: "none",
          resize: "none",
          margin: "10px",
          width: "100%",
          fontSize: "20px",
          fontFamily: "Arial",
          margin: "12px",
          "& fieldset": {
            borderRadius: "30px",
          },

          "& .MuiInputBase-input": {
            color: "rgb(10, 10, 10)",
          },
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeySend}
      />

      <div className="send">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ThemeProvider theme={theme}>
            <Button size="small" variant="standard">
              <SettingsVoiceIcon
                color="primary"
                sx={{ margin: "0px 20px 0px 20px" }}
              />
            </Button>
          </ThemeProvider>

          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              id="file"
              name="file"
              type="file"
              w
              accept="image/*,.pdf"
              onChange={(e) => {
                const fileExt = e.currentTarget.files[0].name?.split(".").pop();
                if (fileExt === "pdf") {
                  setIsPdf(true);
                  setSelectedFile(e.currentTarget.files[0]);
                  console.log(fileExt);
                } else {
                  setSelectedFile(e.currentTarget.files[0]);
                  setIsPdf(false);
                }
              }}
            />

            <AttachFileIcon />
          </IconButton>

          <ThemeProvider theme={theme}>
            <Button size="small" variant="standard">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input hidden accept="image/*" type="selectedFile" />

                <PhotoCameraIcon />
              </IconButton>
            </Button>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Button
              size="small"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={(text || selectedFile) && handleSend}
            >
              send
            </Button>
          </ThemeProvider>
        </Stack>
      </div>
    </div>
  );
};
export default Input;

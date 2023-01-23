```
TODO: PREVIEW OF IMAGE BEFORE SENDING
    ```

// import React, { useState, useContext } from "react";
// import "./Test.css";

// //MUI imports
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import SendIcon from "@mui/icons-material/Send";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import Stack from "@mui/material/Stack";
// import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
// import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
// import { ThemeProvider } from "@mui/material/styles";

// //local imports
// import { theme } from "../theme";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";
// import { db, storage } from "../firebase";

// //Some firebase stuff
// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// //v4
// import { v4 as uuid } from "uuid";
// // import { TextField } from "@mui/material";

// const Input = () => {
//   const [err, setErr] = useState(false);
//   const [text, setText] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [imageUrl, setImageUrl] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   //------------------------------------------------------

//   // useEffect(() => {
//   //   if (selectedImage) {
//   //     setImageUrl(URL.createObjectURL(selectedImage));
//   //   }
//   // }, [selectedImage]);

//   const handleSend = async () => {
//     if (selectedImage) {
//       const storageRef = ref(storage, uuid());
//       const uploadTask = uploadBytesResumable(storageRef, selectedImage);

//       uploadTask.on(
//         (err) => {
//           setErr(true);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//             await updateDoc(doc(db, "chats", data.chatId), {
//               messages: arrayUnion({
//                 id: uuid(),
//                 text,
//                 senderId: currentUser.uid,
//                 file: downloadURL,
//               }),
//             });
//           });
//         }
//       );
//     } else {
//       await updateDoc(doc(db, "chats", data.chatId), {
//         messages: arrayUnion({
//           id: uuid(),
//           text,
//           senderId: currentUser.uid,
//         }),
//       });
//     }

//     await updateDoc(doc(db, "userChats", currentUser.uid), {
//       [data.chatId + ".lastMessage"]: {
//         text,
//       },
//       [data.chatId + ".date"]: serverTimestamp(),
//     });

//     await updateDoc(doc(db, "userChats", data.user.uid), {
//       [data.chatId + ".lastMessage"]: {
//         text,
//       },
//       [data.chatId + ".date"]: serverTimestamp(),
//     });

//     setText("");
//     setSelectedImage(null);
//   };

//   //------------------------------------------------------

//   return (
//     <div className="input">
//       <InsertEmoticonIcon color="primary" />

//       <textarea
//         rows="3"
//         cols="60"
//         fullwidth
//         placeholder="Type a message ..."
//         type="text"
//         style={{
//           overflow: "auto hidden",
//           border: "none",
//           outline: "none",
//           resize: "none",
//           margin: "20px 0px 0px 10px",
//         }}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <div className="send">
//         <Stack direction="row" alignItems="center" spacing={0.5}>
//           <SettingsVoiceIcon
//             color="primary"
//             sx={{ margin: "0px 20px 0px 20px" }}
//           />
//           <IconButton
//             color="primary"
//             aria-label="upload picture"
//             component="label"
//           >
//             <input
//               hidden
//               id="file"
//               name="file"
//               type="file"
//               accept="image/*,video/*,.pdf,.csv"
//               onChange={(e) => setSelectedImage(e.currentTarget.files[0])}
//             />

//             <AttachFileIcon />
//           </IconButton>

//           <IconButton
//             color="primary"
//             aria-label="upload picture"
//             component="label"
//           >
//             <input hidden accept="image/*" type="selectedImage" />

//             <PhotoCameraIcon />
//           </IconButton>

//           <ThemeProvider theme={theme}>
//             <Button
//               size="small"
//               variant="contained"
//               endIcon={<SendIcon />}
//               onClick={(text || selectedImage) && handleSend}
//             >
//               send
//             </Button>
//           </ThemeProvider>
//         </Stack>
//       </div>
//     </div>
//   );
// };
// export default Input;




// import React, { useState, useContext, useRef } from "react";
// import "./Test.css";

// //MUI imports
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import SendIcon from "@mui/icons-material/Send";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import Stack from "@mui/material/Stack";
// import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
// import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
// import { ThemeProvider } from "@mui/material/styles";

// //local imports
// import { theme } from "../theme";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";
// import { db, storage } from "../firebase";

// //Some firebase stuff
// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// //v4
// import { v4 as uuid } from "uuid";
// // import { TextField } from "@mui/material";

// const Input = () => {
//   const [err, setErr] = useState(false);
//   const [text, setText] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [imageUrl, setImageUrl] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   //------------------------------------------------------
//   const filePicekerRef = useRef(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);

//   const previewFile = (e) => {
//     // Reading New File (open file Picker Box)
//     const reader = new FileReader();

//     // Gettting Selected File (user can select multiple but we are choosing only one)
//     const selectedFile = e.target.files[0];

//     setSelectedImage(selectedImage);

//     console.log(selectedImage)

//     if (selectedFile) {
//       reader.readAsDataURL(selectedFile);
//     }

//     // As the File loaded then set the stage as per the file type
//     reader.onload = (readerEvent) => {
//       if (selectedFile.type.includes("image")) {
//         setImagePreview(readerEvent.target.result);
//       } else if (selectedFile.type.includes("video")) {
//         setVideoPreview(readerEvent.target.result);
//       }
//     };
//   };

//   const clearFiles = () => {
//     setImagePreview(null);
//     setVideoPreview(null);
//   };

//   //----------------------------------------------------------------

//   const handleSend = async () => {
//     console.log(selectedImage);
//     if (selectedImage) {
//       const storageRef = ref(storage, uuid());
//       const uploadTask = uploadBytesResumable(storageRef, selectedImage);

//       uploadTask.on(
//         (err) => {
//           setErr(true);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//             await updateDoc(doc(db, "chats", data.chatId), {
//               messages: arrayUnion({
//                 id: uuid(),
//                 text,
//                 senderId: currentUser.uid,
//                 file: downloadURL,
//               }),
//             });
//           });
//         }
//       );
//     } else {
//       await updateDoc(doc(db, "chats", data.chatId), {
//         messages: arrayUnion({
//           id: uuid(),
//           text,
//           senderId: currentUser.uid,
//         }),
//       });
//     }

//     await updateDoc(doc(db, "userChats", currentUser.uid), {
//       [data.chatId + ".lastMessage"]: {
//         text,
//       },
//       [data.chatId + ".date"]: serverTimestamp(),
//     });

//     await updateDoc(doc(db, "userChats", data.user.uid), {
//       [data.chatId + ".lastMessage"]: {
//         text,
//       },
//       [data.chatId + ".date"]: serverTimestamp(),
//     });

//     setText("");
//     setSelectedImage(null);
//   };

//   //------------------------------------------------------

//   return (
//     <div className="input">
//       <InsertEmoticonIcon color="primary" />

//       <textarea
//         rows="3"
//         cols="60"
//         fullwidth
//         placeholder="Type a message ..."
//         type="text"
//         style={{
//           overflow: "auto hidden",
//           border: "none",
//           outline: "none",
//           resize: "none",
//           margin: "20px 0px 0px 10px",
//         }}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <div className="send">
//         <Stack direction="row" alignItems="center" spacing={0.5}>
//           <SettingsVoiceIcon
//             color="primary"
//             sx={{ margin: "0px 20px 0px 20px" }}
//           />
//           <IconButton
//             color="primary"
//             aria-label="upload picture"
//             component="label"
//             onClick={() => filePicekerRef.current.click()}
//           >
//             <input
//               hidden
//               id="file"
//               name="file"
//               type="file"
//               accept="image/*,video/*,.pdf,.csv"
//               onChange={previewFile}
//               // onChange={(e) => setSelectedImage(e.currentTarget.files[0])}
//             />

//             <AttachFileIcon />
//           </IconButton>

//           {(imagePreview || videoPreview) && (
//             <button className="btn" onClick={clearFiles}>
//               x
//             </button>
//           )}

//           <IconButton
//             color="primary"
//             aria-label="upload picture"
//             component="label"
//           >
//             <input hidden accept="image/*" type="selectedImage" />

//             <PhotoCameraIcon />
//           </IconButton>

//           <ThemeProvider theme={theme}>
//             <Button
//               size="small"
//               variant="contained"
//               endIcon={<SendIcon />}
//               onClick={(text || selectedImage) && handleSend}
//             >
//               send
//             </Button>
//           </ThemeProvider>
//         </Stack>

//         <div className="preview">
//           {imagePreview != null && <img src={imagePreview} alt="" />}
//           {videoPreview != null && <video controls src={videoPreview}></video>}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Input;

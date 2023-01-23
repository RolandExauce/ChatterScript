import { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
  const [start, setStart] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [messageId, setMessageId] = useState(null)
  const [typing, setTyping] = useState(false)

  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider
      value={{ data: state, dispatch, start, setStart, isPdf, setIsPdf, messageId, setMessageId}}
    >
      {children}
    </ChatContext.Provider>
  );
};

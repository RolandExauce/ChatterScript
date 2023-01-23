import { createTheme } from "@mui/material/styles";

//Theme constant to style globally
export const theme = createTheme({
  palette: {
    primary: {
      main: "#01579b",
      fontFamily: "arial",
    },
    secondary: {
      main: "#4fc3f7",
    },
    iconLock: {
      main: "#01579b",
    },

    deleteButtons: {
      main: "#ff1744",
    },

    pdfButton: {
      main: "rgb(212, 200, 146)",
    },
  },
});

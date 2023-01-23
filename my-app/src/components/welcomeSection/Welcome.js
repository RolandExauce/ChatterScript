import React, { useState } from "react";

//MUI
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LockIcon from "@mui/icons-material/Lock";
import { ThemeProvider } from "@mui/material";

//local
import ChatterScriptWeb from "../../img/ChatterScriptWeb.png";
import { theme } from "../../theme";

import {
  WelcomeContainer,
  WelcomeContent,
  WelcomeTitle,
  MessageInfo,
  TypoWrapper,
  StyledImage,
  ArrowRight,
  ArrowForward,
} from "./WelcomeElements";

const Welcome = () => {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };

  return (
    <WelcomeContainer id="home">
      <WelcomeContent>
        <StyledImage src={ChatterScriptWeb} />

        <WelcomeTitle>ChatterScript Web</WelcomeTitle>

        <MessageInfo>
          Send and receive messages without to connect to your phone. Connect up
          to 4 devices and a mobile phone.
        </MessageInfo>

        <TypoWrapper>
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginTop: "20px", justifyContent: "space-evenly" }}
          >
            <LockIcon sx={{ color: "#747474" }} />
            <Typography sx={{ color: "#747474" }}>
              Your Communication is secured
            </Typography>
          </Stack>
        </TypoWrapper>

        <TypoWrapper>
          <ThemeProvider theme={theme}>
            <Button
              fullWidth
              to="signup"
              smooth={true}
              duration={500}
              spy={true}
              offset={-80}
              onMouseEnter={onHover}
              onMouseLeave={onHover}
              color="primary"
              variant="contained"
              sx={{
                margin: "30px 0px 0px 20px",
              }}
            >
              <Typography
                variant="h7"
                sx={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Download the App
              </Typography>
              {hover ? <ArrowForward /> : <ArrowRight />}
            </Button>
          </ThemeProvider>
        </TypoWrapper>
      </WelcomeContent>
    </WelcomeContainer>
  );
};
export default Welcome;

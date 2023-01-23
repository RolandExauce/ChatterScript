import styled from "styled-components";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ForwardIcon from "@mui/icons-material/Forward";

export const WelcomeContainer = styled.div`
  background-size: cover; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: 100%;
  position: relative;
  z-index: 1;
  backgound-color: rgb(208, 229, 247);
`;

export const WelcomeContent = styled.div`
  z-index: 4;
  max-width: 1200px;
  position: absolute;
  padding: 8px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const WelcomeTitle = styled.h1`
  color: #747474;
  font-size: 48px;
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
  @media screen and (max-width: 480px) {
    font-size: 32px;
  }
`;

export const MessageInfo = styled.p`
  margin-top: 24px;
  color: #444444;
  font-size: 20px;
  text-align: center;
  max-width: 600px;

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

export const StyledImage = styled.img`
  width: 60%;
  height: 60%;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

export const TypoWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ArrowForward = styled(ForwardIcon)`
  margin-left: 8px;
  font-size: 20px;
`;

export const ArrowRight = styled(ArrowRightAltIcon)`
  margin-left: 8px;
  font-size: 20px;
`;

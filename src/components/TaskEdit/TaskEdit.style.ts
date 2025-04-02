import styled from "@emotion/styled";
import { Button, Card, CardContent } from "@mui/material";

export const StyledCard = styled(Card)`
  background-color: #ecf3f7;
  height: 100vh;

  > .MuiCardHeader-root {
    background-color: #1a4876;
    color: white;
  }

  & textarea {
    padding: 10px;
    background-color: white;
  }
`;

export const StyledButton = styled(Button)`
  border-radius: 15px;
  padding: 5px 15px;
  background-color: #008cf0;
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

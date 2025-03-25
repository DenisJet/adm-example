import styled from "@emotion/styled";
import { Button, Card, CardContent } from "@mui/material";

export const StyledCard = styled(Card)`
  background-color: #f0f9ff;
  min-width: 275px;
  height: 100vh;

  & .MuiCardHeader-root {
    background-color: #075985;
    color: white;
  }
`;

export const StyledButton = styled(Button)`
  border-radius: 15px;
  padding: 5px 15px;
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

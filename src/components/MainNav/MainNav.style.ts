import styled from "@emotion/styled";
import { List, ListItemButton, OutlinedInput, Toolbar } from "@mui/material";
import Link from "next/link";

export const StyledInput = styled(OutlinedInput)`
  background-color: white;
  border-radius: 15px;
  width: 100%;
  max-width: 560px;

  & input {
    padding: 5px 10px !important;
  }
`;

export const StyledListItem = styled(ListItemButton)`
  display: flex;
  flex-direction: column;
`;

export const StyledList = styled(List)`
  padding: 0;
  background-color: #082f49;
  height: 100%;
`;

export const StyledLink = styled(Link)`
  color: white;
  font-size: 12px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledToolBar = styled(Toolbar)`
  background-color: #bae6fd;
  padding: 16px;
`;

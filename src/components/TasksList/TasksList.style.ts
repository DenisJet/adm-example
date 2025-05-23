import styled from "@emotion/styled";
import { Table } from "@mui/material";
import { Button } from "@mui/material";

export const StyledTable = styled(Table)`
  & tbody tr {
    cursor: pointer;

    &:hover {
      background-color: #f0f9ff;
    }
  }

  & td {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    & span {
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
    }
  }

  & td:nth-child(1) {
    width: 50px;
  }
`;

export const StyledButton = styled(Button)`
  border-radius: 15px;
  padding: 5px 15px;
  background-color: #008cf0;
`;

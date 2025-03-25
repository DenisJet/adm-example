import styled from "@emotion/styled";
import { Table } from "@mui/material";

export const StyledTable = styled(Table)`
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

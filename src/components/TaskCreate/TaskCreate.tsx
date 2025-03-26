import {
  Alert,
  CardActions,
  CardContent,
  CardHeader,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import * as SC from "../TaskEdit/TaskEdit.style";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "axios";
import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { useAppDispatch } from "@/store/store.hooks";
import { getTasks } from "@/store/tasks.slice";

export default function TaskCreate({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const dispatch = useAppDispatch();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleAddTask = async () => {
    if (!name.trim()) return;

    try {
      await axios.post(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
        name: name,
        description: description,
      });

      await dispatch(getTasks());

      setSnackbar({
        open: true,
        message: "Заявка успешно создана",
        isError: false,
      });
      onClose();
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
      setSnackbar({
        open: true,
        message: "Не удалось создать заявку",
        isError: true,
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", isError: false });
  };

  return (
    <SC.StyledCard>
      <CardHeader
        title="Новая заявка"
        action={<CloseIcon onClick={onClose} />}
      />
      <CardContent>
        <Typography color="text.secondary" variant="subtitle2">
          Название*
        </Typography>
        <TextField
          required
          value={name}
          onChange={handleNameChange}
          id="name"
          label="Введите название"
          variant="standard"
          multiline
          fullWidth
          rows={4}
        />
      </CardContent>
      <CardContent>
        <Typography color="text.secondary" variant="subtitle2">
          Описание
        </Typography>
        <TextField
          value={description}
          onChange={handleDescriptionChange}
          id="description"
          label="Введите описание"
          variant="standard"
          multiline
          fullWidth
          rows={8}
        />
      </CardContent>
      <CardActions>
        <SC.StyledButton
          size="small"
          variant="contained"
          disabled={!name.trim()}
          onClick={handleAddTask}
        >
          Добавить заявку
        </SC.StyledButton>
      </CardActions>
      <Snackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SC.StyledCard>
  );
}

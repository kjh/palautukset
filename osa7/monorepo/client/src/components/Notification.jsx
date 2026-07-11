import { useNotification } from "../store";
import { Alert } from "@mui/material";

const Notification = () => {
  const notification = useNotification();

  if (!notification.text) return null;

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  );
};

export default Notification;

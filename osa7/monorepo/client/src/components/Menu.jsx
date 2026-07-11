import { Link } from "react-router-dom";
import Notification from "./Notification";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Menu = ({ user, handleLogout }) => {
  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Blogg App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={style}>
            users
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={style}>
            new blog
          </Button>
          {user && (
            <Button color="inherit" onClick={handleLogout} sx={style}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Notification />
    </div>
  );
};

export default Menu;

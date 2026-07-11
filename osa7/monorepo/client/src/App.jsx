import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormLabel,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
//import Footer from './components/Footer'
import SingleBlog from "./components/SingleBlog";
import Notification from "./components/Notification";
//import LoginForm from './components/LoginForm'
//import NoteForm from './components/BlogForm'
import Togglable from "./components/Togglable";
import loginService from "./services/login";
import blogService from "./services/blogs";

import BlogForm from "./components/BlogForm";
import ErrorBoundary from "./ErrorBoundary";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from "react-router-dom";
import Menu from "./components/Menu";
import NotFoundError from "./components/NotFoundError";
import { useField } from "./hooks";

import {
  useBlogs,
  useBlogActions,
  useUser,
  useUserActions,
  useNotificationActions,
  useAllUsers,
} from "./store";
import {
  getUser as getPersistentUser,
  saveUser as savePersistentUser,
  removeUser as removePersistentUser,
} from "./services/persistentUser";

const App = () => {
  const { initialize, add, like, remove, comment } = useBlogActions();
  const blogs = useBlogs();

  const { setUser, initUsers } = useUserActions();
  const user = useUser();

  const allUsers = useAllUsers();
  const { setNotificationMessage } = useNotificationActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    initUsers();
  }, [initUsers]);

  const username = useField("text");
  const password = useField("password");

  const match = useMatch("/users/:id");

  const blogUser = match
    ? allUsers.find((u) => u.id === match.params.id)
    : null;

  const matchBlog = useMatch("/blogs/:id");

  const blog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null;

  useEffect(() => {
    const user = getPersistentUser();
    if (user) {
      setUser(user);
      console.log("user from local storage", user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    await add(blogObject);
  };

  const updateBlog = async (blogObject) => {
    console.log("update:", blogObject);
    await like(blogObject.id);
  };

  const deleteBlog = async (blogObject) => {
    await remove(blogObject.id);
  };

  const commentBlog = async (id, text) => {
    await comment(id, text);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username.inputProps.value,
        password: password.inputProps.value,
      });
      console.log("user from login service", user);
      savePersistentUser(user);
      blogService.setToken(user.token);
      setUser(user);
      username.reset();
      password.reset();
    } catch {
      setNotificationMessage("wrong username or password", "error");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    removePersistentUser();
    setUser(null);
    window.location.reload();
  };

  const loginForm = () => (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 250 }}
    >
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, fontWeight: 400 }}>
          username
          <TextField {...username.inputProps} />
        </FormLabel>
      </FormControl>

      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, fontWeight: 400 }}>
          password
          <TextField {...password.inputProps} />
        </FormLabel>
      </FormControl>
      <Button type="submit">login</Button>
    </Box>
  );

  const blogForm = () => <BlogForm user={user} createBlog={addBlog} />;
  return (
    <Container>
      <>
        <Menu user={user} handleLogout={handleLogout} />
        <ErrorBoundary>
          <Routes>
            <Route
              path="/users"
              element={
                <div>
                  <h2>Users</h2>

                  {user && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Blogs created</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell>
                                <Link to={`/users/${u.id}`}>{u.name}</Link>
                              </TableCell>
                              <TableCell>{u.username}</TableCell>
                              <TableCell>{u.blogs?.length || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              }
            />
            <Route path="/create" element={blogForm()} />
            <Route
              path="/"
              element={
                <div>
                  {!user && loginForm()}
                  {user && (
                    <ul>
                      {blogs.map((blog) => (
                        <li key={blog.id}>
                          <Link to={`/blogs/${blog.id}`}>
                            {blog.title} {blog.author}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                blog ? (
                  <SingleBlog
                    key={blog.id}
                    blog={blog}
                    updateBlog={updateBlog}
                    deleteBlog={deleteBlog}
                    commentBlog={commentBlog}
                    user={user}
                  />
                ) : (
                  <div>No blog found</div>
                )
              }
            />
            <Route
              path="/users/:id"
              element={
                blogUser ? (
                  <div>
                    <h2>{blogUser.name}</h2>
                    <h3>added blogs</h3>
                    <ul>
                      {blogUser.blogs.map((blog) => (
                        <li key={blog.id}>{blog.title}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>No user found</div>
                )
              }
            />
            <Route
              path="*"
              element={
                <div>
                  <NotFoundError />
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </>
    </Container>
  );
};

export default App;

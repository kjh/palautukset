export const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
  if (loggedUserJSON) {
    return JSON.parse(loggedUserJSON);
  }
  return null;
};

export const saveUser = (user) => {
  window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
};

export const removeUser = () => {
  window.localStorage.removeItem("loggedBlogappUser");
};

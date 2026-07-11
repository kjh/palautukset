import { TextField, Button, Link } from "@mui/material";
import { useField } from "../hooks";

const SingleBlog = ({ blog, updateBlog, deleteBlog, commentBlog, user }) => {
  const newComment = useField("text");

  if (!blog) {
    return null;
  }

  const isOwner = blog.user?.username === user?.username;

  const handleAddComment = async (event) => {
    event.preventDefault();
    await commentBlog(blog.id, newComment.inputProps.value);
    newComment.reset();
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>{blog.title}</div>
      <div>by {blog.author}</div>
      <div>
        <Link href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </Link>
      </div>
      <div>added by {blog.user ? blog.user.name : "-"}</div>
      <div>
        {blog.likes} likes
        {user && (
          <Button
            onClick={() => updateBlog(blog)}
            variant="contained"
            style={{ marginTop: 10 }}
          >
            like
          </Button>
        )}
      </div>
      {isOwner && (
        <Button
          onClick={() => deleteBlog(blog)}
          variant="contained"
          style={{ marginTop: 10 }}
        >
          remove
        </Button>
      )}
      <div>
        <h3>comments</h3>

        <form onSubmit={handleAddComment}>
          <TextField {...newComment.inputProps} placeholder="write a comment" />
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            add comment
          </Button>
        </form>
        <ul>
          {blog.comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleBlog;

import { useField } from "../hooks";
import styled from "styled-components";

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`;

const Input = styled.input`
  margin: 0.25em;
  width: 220px;
`;

const BlogForm = ({ user, createBlog }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  if (!user) {
    return null;
  }

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title.inputProps.value,
      author: author.inputProps.value,
      url: url.inputProps.value,
    });

    title.reset();
    author.reset();
    url.reset();
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <label>
          Title:
          <Input {...title.inputProps} />
        </label>
        <br />
        <label>
          Author:
          <Input {...author.inputProps} />
        </label>
        <br />
        <label>
          Url:
          <Input {...url.inputProps} />
        </label>
        <br />
        <Button type="submit">create</Button>
      </form>
    </div>
  );
};

export default BlogForm;

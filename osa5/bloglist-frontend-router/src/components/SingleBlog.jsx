import { useState } from 'react'

const SingleBlog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  //const hideWhenVisible = { display: visible ? 'none' : '' }
  //const showWhenVisible = { display: visible ? '' : 'none' }

  if(!blog) {
    return null
  }


  const isOwner = blog.user?.username === user?.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  /*return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <button style={hideWhenVisible} onClick={toggleVisibility}>show</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div style={showWhenVisible}>{blog.url}</div>
      <div style={showWhenVisible}>{blog.likes}<button onClick={() => updateBlog(blog)}>like</button></div>
      <div style={showWhenVisible}>{blog.user ? blog.user.name : '-'}</div>
      {isOwner && (
        <button style={showWhenVisible} onClick={() => deleteBlog(blog)}>remove</button>
      )}
    </div>
  )*/
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
          <div>{blog.url}</div>
      <div>
        {blog.likes}
        {user && (
          <button onClick={() => updateBlog(blog)}>like</button>
        )}
      </div>
          <div>{blog.user ? blog.user.name : '-'}</div>
          {isOwner && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
    </div>
  )
}

export default SingleBlog
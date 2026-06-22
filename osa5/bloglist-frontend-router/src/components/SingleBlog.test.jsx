import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SingleBlog from './SingleBlog'

describe('<SingleBlog />', () => {
  const blog = {
    title: 'Title text',
    author: 'Author Test',
    url: 'www.fi',
    likes: 123,
    user: {
      'username': 'erkki',
      'name': 'Superuserer',
      'id': '6988db95dd49d50750286f02'
    }
  }

  const user = {
    'username': 'erkki',
    'name': 'Superuserer',
    'id': '6988db95dd49d50750286f02'
  }

  const user2 = {
    'username': 'erkki2',
    'name': 'Superuserer2',
    'id': '6988db95dd49d50750286f022'
  }
  let mockHandler = vi.fn()
  let container
  /*beforeEach(() => {
    const result = render(<SingleBlog blog={blog} user={null} updateBlog={mockHandler} />)
    container = result.container
    screen.debug()
  })*/

  test('unauthenticated user sees only blog info but no buttons', () => {
    const result = render(<SingleBlog blog={blog} user={null} updateBlog={mockHandler} />)
    container = result.container
    screen.debug()

    const blogDiv = container.querySelector('div')
    expect(blogDiv.textContent).toContain('Title text')
    expect(blogDiv.textContent).toContain('Author Test')

    const url = screen.queryByText('www.fi')
    expect(url).not.toBeNull()

    const likes = screen.queryByText('123')
    expect(likes).not.toBeNull()

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
    const result = render(<SingleBlog blog={blog} user={user2} updateBlog={mockHandler} />)
    container = result.container
    screen.debug()

    expect(screen.queryByText('like')).not.toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('Authenticated blog’s creator is also shown the delete button', () => {
    const result = render(<SingleBlog blog={blog} user={user} updateBlog={mockHandler} />)
    container = result.container
    screen.debug()

    expect(screen.queryByText('like')).not.toBeNull()
    expect(screen.queryByText('remove')).not.toBeNull()
  })
})
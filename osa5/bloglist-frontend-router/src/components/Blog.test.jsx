import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
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
  let mockHandler = vi.fn()
  let container
  beforeEach(() => {
    const result = render(<Blog blog={blog} user={user} updateBlog={mockHandler}/>)
    container = result.container
    screen.debug()
  })

  test('renders title and author but not url and liked when not opened', () => {
    /*const blog = {
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

    const { container } = render(<Blog blog={blog} user={user} />)*/
    const blogDiv = container.querySelector('div')
    expect(blogDiv.textContent).toContain('Title text')
    expect(blogDiv.textContent).toContain('Author Test')

    const url = screen.queryByText('www.fi')
    expect(url).toBeNull()

    const likes = screen.queryByText('123')
    expect(likes).toBeNull()

    /*screen.debug()*/
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.debug()

    const url = screen.getByText('www.fi')
    expect(url).toBeVisible()

    const likes = screen.getByText('123')
    expect(likes).toBeVisible()
  })

  test('clicking the like 2 times button calls event handler 2 times', async () => {
    screen.debug()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.debug()

    const like = screen.getByText('like')
    await user.click(like)
    await user.click(like)

    screen.debug()

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
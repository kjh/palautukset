import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('createBlog callback handler has correct data when blog is created', async () => {
    const mockHandler = vi.fn()

    render(<BlogForm createBlog={mockHandler} />)

    const user = userEvent.setup()

    const title = screen.getByLabelText('Title:')
    const author = screen.getByLabelText('Author:')
    const url = screen.getByLabelText('Url:')
    const sendButton = screen.getByText('create')

    await user.type(title, 'testing a form title ...')
    await user.type(author, 'testing a form author...')
    await user.type(url, 'testing a form url...')

    await user.click(sendButton)

    expect(mockHandler).toHaveBeenCalledTimes(1)

    const callInputData = mockHandler.mock.calls[0][0]

    console.log(mockHandler.mock.calls[0][0])

    expect(callInputData.title).toBe('testing a form title ...')
    expect(callInputData.author).toBe('testing a form author...')
    expect(callInputData.url).toBe('testing a form url...')
  })

})
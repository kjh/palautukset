const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await request.post('/api/users', {
            data: {
                name: 'Heidi Testaaja',
                username: 'heidit',
                password: 'salainen1'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByText('login')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen123')

            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'title str', 'author str', 'www.fi')
            await expect(page.getByText('title str author str')).toBeVisible()
        })

        /*test('two blogs can be created', async ({ page }) => {
             await createBlog(page, 'eka blogi', 'author str', 'www.fi')
             await createBlog(page, 'toinen blogi', 'author str', 'www.fi')
             await expect(page.getByText('eka blogi author str')).toBeVisible()
             await expect(page.getByText('toinen blogi author str')).toBeVisible()
         })*/

        describe('and several blogs exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'eka blogi', 'author str', 'www.fi')
                await createBlog(page, 'toinen blogi', 'author str', 'www.toka.fi')
            })

            test('specific blog can be liked', async ({ page }) => {
                const otherBlogText = page.getByText('toinen blogi author str')
                const otherBlogElement = otherBlogText.locator('..')

                await otherBlogElement.getByRole('button', { name: 'view' }).click()
                await expect(otherBlogElement.getByText('www.toka.fi')).toBeVisible()

                await otherBlogElement.getByRole('button', { name: 'like' }).click()
                await expect(otherBlogElement.getByText('1')).toBeVisible()
            })

            test('blogs are ordered by likes', async ({ page }) => {
                const blog1 = page.getByText('eka blogi author str').locator('..')

                await blog1.getByRole('button', { name: 'view' }).click()
                await expect(blog1.getByText('www.fi')).toBeVisible()
                await expect(blog1.getByText('0')).toBeVisible()


                const blog2 = page.getByText('toinen blogi author str').locator('..')

                await blog2.getByRole('button', { name: 'view' }).click()
                await expect(blog2.getByText('www.toka.fi')).toBeVisible()
                await expect(blog2.getByText('0')).toBeVisible()
                await blog2.getByRole('button', { name: 'like' }).click()
                await expect(blog2.getByText('1')).toBeVisible()


                let blogsList = page.locator('div[style*="padding-top"][style*="border"]')
                let texts = []

                for (let i = 0; i < 2; i++) {
                    const t = await blogsList.nth(i).innerText()
                    texts.push(t)
                }

                expect(texts.findIndex(t => t.includes('0like'))).toBe(0)
                expect(texts.findIndex(t => t.includes('1like'))).toBe(1)

                await blog1.getByRole('button', { name: 'like' }).click()
                await expect(blog1.getByText('1')).toBeVisible()
                await blog1.getByRole('button', { name: 'like' }).click()
                await expect(blog1.getByText('2')).toBeVisible()

                blogsList = page.locator('div[style*="padding-top"][style*="border"]')
                texts = []

                for (let i = 0; i < 2; i++) {
                    const t = await blogsList.nth(i).innerText()
                    texts.push(t)
                }

                expect(texts.findIndex(t => t.includes('1like'))).toBe(0)
                expect(texts.findIndex(t => t.includes('2like'))).toBe(1)
            })

        })
    })

    describe('when logged in and blog is created', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')

            await createBlog(page, 'title str', 'author str', 'www.fi')
            await expect(page.getByText('title str author str')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('1')).toBeVisible()
        })

        test('blog can be deleted', async ({ page }) => {
            page.on('dialog', async dialog => {
                expect(dialog.type()).toBe('confirm')
                expect(dialog.message()).toContain('Remove')
                await dialog.accept()
            })
            await expect(page.getByText('title str author str')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()

            await page.getByRole('button', { name: 'remove' }).click()

            await expect(page.getByText('title str author str')).not.toBeVisible()
        })

        test('blog remove button is not viewn if user is not creator', async ({ page }) => {
            await page.getByRole('button', { name: 'logout' }).click()

            await loginWith(page, 'heidit', 'salainen1')

            await expect(page.getByText('title str author str')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()

            await expect(page.getByText('www.fi')).toBeVisible()

            await expect(page.getByText('remove')).not.toBeVisible()
        })
    })
})
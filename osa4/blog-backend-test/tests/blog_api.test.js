const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        //await User.deleteMany({})
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await User.deleteMany({})
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const title = response.body.map(e => e.title)
        assert(title.includes('this is test'))
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs have field id and not the default field _id', async () => {
        const response = await api.get('/api/blogs')

        response.body.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })

    describe('viewing a specific blog', () => {
        test('a specific blog can be viewed', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api.get(`/api/blogs/${invalidId}`).expect(400)
        })
    })

    describe('addition of a new blog', () => {
        test('missing token causes fail with statuscode 401', async () => {
            
            const newBlog = {
                title: 'this is test 2',
                author: 'erkki miettinen',
                url: 'http://testing.org',
                likes: 2
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer `)
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })

        test('a valid blog can be added ', async () => {
            
            const newBlog = {
                title: 'this is test 2',
                author: 'erkki miettinen',
                url: 'http://testing.org',
                likes: 2
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(n => n.title)
            assert(titles.includes('this is test 2'))
        })

        test('blog has default likes of 0 if not given', async () => {
            const newBlog = {
                title: 'default values of missing fields',
                author: 'Pekka Pouta',
                url: 'http://lost.org',
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const addedBlog = blogsAtEnd.find(b => b.title === newBlog.title)
            assert.ok(addedBlog)
            assert.strictEqual(addedBlog.likes, 0)
        })

        test('blog without url is not added', async () => {
            const newBlog = {
                title: 'default values of missing fields',
                author: 'Pekka Pouta',
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('blog without title is not added', async () => {
            const newBlog = {
                author: 'Pekka Pouta',
                url: 'http://lost.org',
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('succeeds with valid data', async () => {
            const newBlog = {
                title: 'this is test 2',
                author: 'erkki miettinen',
                url: 'http://testing.org',
                likes: 2
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            /*    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)*/

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(n => n.title)
            assert(titles.includes('this is test 2'))
        })

        /*test('fails with status code 400 if data invalid', async () => {
            const newBlog = { important: true }

            await api.post('/api/blogs').send(newBlog).expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })*/
    })

    describe('updating of a blog', () => {
        test('a blog can be updated', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)

            const updatedBlog = { ...resultBlog.body, likes: resultBlog.body.likes + 1 }
            
            await api
                .put(`/api/blogs/${updatedBlog.id}`)
                .send(updatedBlog)
                .expect(200)

            const blogAfterUpdate = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            assert.strictEqual(blogAfterUpdate.body.likes, resultBlog.body.likes + 1)
        })
    })

    describe('deletion of a blog', () => {
        test('a blog can be deleted', async () => {
            const newBlog = {
                title: 'this is test 2',
                author: 'erkki miettinen',
                url: 'http://testing.org',
                likes: 2
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            const savedBlog = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfterAdd = await helper.blogsInDb()
            assert.strictEqual(blogsAfterAdd.length, helper.initialBlogs.length + 1)

            await api
                .delete(`/api/blogs/${savedBlog.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const ids = blogsAtEnd.map(n => n.id)
            assert(!ids.includes(savedBlog.id))

            assert.strictEqual(blogsAtEnd.length, blogsAfterAdd.length - 1)
        })

        test('succeeds with status code 204 if id is valid', async () => {
            const newBlog = {
                title: 'this is test 2',
                author: 'erkki miettinen',
                url: 'http://testing.org',
                likes: 2
            }

            await api
                .post('/api/users')
                .send({ 
                    username: 'erkki', 
                    name: 'userer', 
                    password: 'salainen1' 
                })

            const loginResponse = await api
                .post('/api/login')
                .send({
                    'username': 'erkki',
                    'password': 'salainen1'
                })

            const token = loginResponse.body.token
          
            const savedBlog = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            await api
                .delete(`/api/blogs/${savedBlog.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
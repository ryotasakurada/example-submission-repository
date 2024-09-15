const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if(!body.username || !body.password) {
    response.json({ error: 'username and password are mandatory keys' }).status(422).end()
  } else if(body.username.length < 3 || body.password.length < 3) {
    response.json({ error: 'username and password needs 3+ length' }).status(422).end()
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      blogs: []
    })

    const savedUser = await user.save()
    response.json(savedUser)
  }
})

module.exports = usersRouter
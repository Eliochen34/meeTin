const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  // 註冊
  getRegisterPage: (req, res) => {
    res.render('register')
  },
  register: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Register Successfully!')
        res.redirect('login')
      })
      .catch(err => next(err))
  },
  // 登入
  getLoginPage: (req, res) => {
    res.render('login')
  },
  login: (req, res, next) => {
    req.flash('success_messages', 'Login Successfully!')
    res.redirect('/rooms')
  }
}

module.exports = userController

#!/usr/bin/env node
import express from 'express'
import mysql   from 'mysql'
import sessions from 'express-session'
import cookieParser from 'cookie-parser'
// directory
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const __rootname = dirname(__dirname)
// config and connect to mysql
import { config }  from './config.js'
var connection = mysql.createConnection(config.mysql)
// construct a web server instance
const app  = express()
const port = 5555
// set the cookie parser
app.use(cookieParser())
// session
app.use(sessions({
  secret: 'beibei',
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 10 },
  resave: true,
}))
var session
// start the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})
// handle other urls
app.use(express.static(`${__rootname}/client`))
// connect to mysql
connection.connect(err => {
  if(err) throw err
  console.log("MYSQL Connected")
})
// initialize Table
connection.query('CREATE TABLE IF NOT EXISTS users   (uid VARCHAR(32), username VARCHAR(64), password VARCHAR(64), mail VARCHAR(64), phone VARCHAR(32))')
connection.query('CREATE TABLE IF NOT EXISTS wallet  (wid VARCHAR(32), name VARCHAR(32), code VARCHAR(64))')
connection.query('CREATE TABLE IF NOT EXISTS history (hid VARCHAR(32), time VARCHAR(64), item VARCHAR(64), money VARCHAR(32), drawee VARCHAR(64))')
connection.query('CREATE TABLE IF NOT EXISTS rel_wu  (wuid VARCHAR(32), wid VARCHAR(32), uid VARCHAR(32), nickname VARCHAR(64))')
connection.query('CREATE TABLE IF NOT EXISTS rel_wh  (whid VARCHAR(32), wid VARCHAR(32), hid VARCHAR(32), state VARCHAR(32))')
connection.query('CREATE TABLE IF NOT EXISTS rel_hu  (huid VARCHAR(32), hid VARCHAR(32), uid VARCHAR(32), state VARCHAR(32))')
// insert user 
app.get('/signupUser', (req, res) => {
  let name = req.query.username
  let pswd = req.query.password
  let post = {username: name, password: pswd}
  let sql  = 'INSERT INTO users SET ?'
  connection.query(sql, post, err => {
    if(err) throw err
    res.send("User is added")
  })
})
// user login
app.get('/loginUser', (req, res) => {
  let name = req.query.username
  let pswd = req.query.password
  let sql  = `SELECT * FROM users WHERE username = ${name}`
  connection.query(sql, (err, results) => {
    if(err) res.send("No this user")
    else if(results == []) res.send("No User Name")
    else if(results[0].password == pswd) {
      session = req.session
      session.username = name
      session.password = pswd
      res.send("Success!")
    }
    else res.send("password is wrong")
  }) 
})
// showAll user
app.get('/showAll-user', (req, res) => {
  console.log(req.session.username)
  let sql = `SELECT COUNT(*) rows FROM users`
  var count = 0
  connection.query(sql, (err, results) => {
    if(err) throw err
    count = results[0].rows
  })
  sql = `SELECT * FROM users`
  let str = ""
  connection.query(sql, (err, results) => {
    if(err) throw err
    for(var i=0; i<count; i++) 
      // res.send(`There are tables: ${results[i].username}`)
      str = str + `user${i+1}: ${results[i].username}, password: ${results[i].password} <br>`
    res.send(str)
  })
})
// insert user wallet
app.get('insertWallet', (req, res) => {
  let wname = req.query.wallet
  let post = {name: wname}
  let sql  = 'INSERT INTO wallet SET ?'
  connection.query(sql, )
})

// select user
app.get('/selectUser', (req, res) => {
  let sql = 'SELECT * FROM users'
  connection.query(sql, (err, results) => {
    if(err) throw err
    console.log(results)
    res.send("Username and Password")
  })
})
// update user
app.get('/updateUser/:password', (req, res) => {
  let newName = 'Updated'
  let sql = `UPDATE users SET username = '${newName}' WHERE password = ${req.params.password}`
  connection.query(sql, err => {
    if(err) throw err
    res.send("Username updated")
  })
})
// delete user
app.get('/deleteUser/:password', (req, res) => {
  let sql = `DELETE FROM users WHERE password = ${req.params.password}`
  connection.query(sql, err => {
    if(err) throw err
    res.send("User deleted")
  })
})

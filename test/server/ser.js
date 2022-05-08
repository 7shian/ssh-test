#!/usr/bin/env node
import express from 'express'
import mysql   from 'mysql'
import sessions from 'express-session'
import cookieParser from 'cookie-parser'
import file from 'session-file-store'
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
const port = 5554
// set the cookie parser
app.use(cookieParser())
// session
var FileStore = file(sessions)
app.use(sessions({
  secret: 'beibei',
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 10 },
  store: new FileStore({
    path: "./sessions",
    reapInterval: 180,//s
  }),
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
// insert user 
app.get('/signupUser', (req, res) => {
  let name = req.query.username
  let pswd = req.query.password
  let post = {username: name, password: pswd}
  let sql  = 'INSERT INTO user SET ?'
  connection.query(sql, post, err => {
    if(err) throw err
    res.send("User is added")
  })
})
// user login
app.get('/loginUser', (req, res) => {
  let name = req.query.username
  let pswd = req.query.password
  let sql  = `SELECT * FROM user WHERE username = ${name}`
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
  let sql = `SELECT COUNT(*) rows FROM user`
  var count = 0
  connection.query(sql, (err, results) => {
    if(err) throw err
    count = results[0].rows
  })
  sql = `SELECT * FROM user`
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
app.get('/insertWallet', (req, res) => {
  // console.log(req.session.username)
  let wname = req.query.wallet
  /*
    generate cache random id code for wallet
  */ 
  let random = 123
  let post = {wname: wname, code: random}
  let sql  = 'INSERT INTO wallet SET ?'
  connection.query(sql, post, err => {
    if(err) throw err
  })
  
  sql  = `INSERT INTO userWallet (uid, wid) VALUES 
          ((SELECT uid FROM user WHERE username = ${req.session.username}),
           (SELECT wid FROM wallet WHERE wname = ${wname}))`
  connection.query(sql, err => {
    if(err) throw err
    res.send(`Wallet is added to user ${req.session.username}`)
  })
})
// delete user wallet 
app.get('/deleteWallet', (req, res) => {
  let wname = req.query.wallet
  let uname = req.session.username
  let sql   = `DELETE FROM userWallet WHERE (uid) LIKE
              (SELECT uid FROM user WHERE username = ${uname})
              AND (wid) LIKE
              (SELECT wid FROM wallet WHERE wname = ${wname})`
  connection.query(sql, err => { if(err) throw err })
  sql = `DELETE FROM wallet WHERE (wname) LIKE ${wname}`
  connection.query(sql, err => { if(err) throw err })
  // res.send(`Wallet is deleted!`)
})

// select user
app.get('/selectUser', (req, res) => {
  let sql = 'SELECT * FROM user'
  connection.query(sql, (err, results) => {
    if(err) throw err
    console.log(results)
    res.send("Username and Password")
  })
})
// update user
app.get('/updateUser/:password', (req, res) => {
  let newName = 'Updated'
  let sql = `UPDATE user SET username = '${newName}' WHERE password = ${req.params.password}`
  connection.query(sql, err => {
    if(err) throw err
    res.send("Username updated")
  })
})
// delete user
app.get('/deleteUser/:password', (req, res) => {
  let sql = `DELETE FROM user WHERE password = ${req.params.password}`
  connection.query(sql, err => {
    if(err) throw err
    res.send("User deleted")
  })
})

#!/usr/bin/env node
import express from 'express'
import mysql   from 'mysql'
import sessions from 'express-session'
import cookieParser from 'cookie-parser'
import file from 'session-file-store'
import bodyParser from 'body-parser'
import crypto from 'crypto';
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
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
const queryPromise = sql => {
  return new Promise((res, rej) => {
    connection.query(sql, (err, rows) => {
      if(err) rej(err);
      else res(rows)
    })
  })
}
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
      session.uid = results[0].uid
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
  //wid needed to generate unique code
  //let hashed = crypto.createHash("sha256").update(wname + "//" + wid, "utf8").digest("hex").substring(1,8);
  let random = 123
  let post = {wname: wname, code: random}
  let sql  = 'INSERT INTO wallet SET ?'
  connection.query(sql, post, err => {
    if(err) throw err
    
  })
  sql  = `INSERT INTO 
            userWallet (uid, wid) 
          VALUES (
            (SELECT uid FROM user WHERE username = ${req.session.username}),
            (SELECT wid FROM wallet WHERE wname = ${wname})
          )`
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
// insert history
app.get('/insertHistory', (req, res) => {
  let money = req.query.money
  let uname = req.session.username
  let item = req.query.item
  let time = req.query.time
  let post = {time: time, item: item, money: money, drawee: uname}
  let sql  = `INSERT INTO history SET ?`
  connection.query(sql, post, err => {
    if(err) throw err
    sql = `INSERT INTO 
             userHistory (uid, hid, ratio) 
           VALUES (
             (SELECT uid FROM user WHERE username = ${uname}),
             (SELECT hid FROM history WHERE money = ${money} AND item = ${item} AND time = "${time}"), 
             1
           )`
    connection.query(sql, err => {
      if(err) throw err
      res.send(`History is added !`)
    })
  })
})
// join wallet
app.get('/joinWallet', (req, res) => {
  let wallet = req.query.wallet
  let uname  = req.session.username
  // should use the wallet code 
  let sql = `INSERT INTO
               userWallet (uid, wid)  
             VALUES (
               (SELECT uid FROM user WHERE username = ${uname}),
               (SELECT wid FROM wallet WHERE wname = ${wallet})
             )
            `
  // let sql = `SELECT wid FROM wallet WHERE wname = ${wallet}`
  connection.query(sql, (err, results) => {
    if(err) throw err
    res.send(`User has joined the wallet: ${wallet}`)
  })
})
// get member from wallet
app.get('/getMember', (req, res) => {
  let wname = req.query.wname
  let str = ""
  let sql = `SELECT wid FROM wallet WHERE wname = ${wname}`
  connection.query(sql, (err, results) => {
    if(err) throw err
    let wid = results[0].wid
    sql = `SELECT uid FROM userWallet WHERE wid = ${wid}`
    connection.query(sql, (err, results) => {
      if(err) throw err
      for(var i=0; i<results.length; i++) {
        let uid = results[i].uid
        sql = `SELECT username FROM user WHERE uid = ${uid}`
        connection.query(sql, (err, results) => {
          if(err) throw err
          str = str + `${results[0].username}<br>`
          console.log(str) // here has output
        })
      }
      // console.log(str) -- no output
    })
  })
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

// get all item & money from the given day
app.post('/checkItems', (req, res) => {
  function promisifysql(f) {
    return (query) => new Promise((query, resolve, reject) => connection.query(query, resolve, reject))
  }
  let param = {
    uid: req.session.uid,
    date: req.body.date
  }
  let sql = `SELECT focusWallet FROM user WHERE uid=1`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT item, money FROM (SELECT history.time, history.item, history.money, walletHistory.wid FROM history INNER JOIN walletHistory ON history.hid=walletHistory.hid) AS sub WHERE (wid=${param.wid} AND time="${param.date}")`
    return queryPromise(sql);
  }).then(result => {
    let ret = {
      date: param.date,
      data: result
    }
    res.send(JSON.stringify(ret));
  }).catch(err => {
    res.status(500).send(e);
  })
})
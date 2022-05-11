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

/***********user************/
// user signup
app.get('/signupUser', (req, res) => {
  const uname = req.query.mail
  const email = req.query.mail
  const pswd = req.query.password
  let sql  = `INSERT INTO user (username, password, mail) VALUES ("${uname}", "${pswd}", "${email}")`
  connection.query(sql, err => {
    if(err) res.status(500).send(err)
    else res.send("User is added")
  })
})
// user login
app.get('/loginUser', (req, res) => {
  const email = req.query.mail
  const name = req.query.username
  const pswd = req.query.password
  let sql  = `SELECT * FROM user WHERE mail = "${email}"`
  connection.query(sql, (err, results) => {
    if(err) res.send("No this user")
    else if(results == []) res.send("No User mail")
    else if(results[0].password == pswd) {
      session = req.session
      session.uid = results[0].uid
      res.send("Success!")
    }
    else res.send("password is wrong")
  }) 
})
// show username
app.get('/showUsername', (req, res) => {
  const uid = req.session.uid
  let sql = `SELECT username FROM user WHERE uid = "${uid}"`
  connection.query(sql, (err, results) => {
    if(err) throw err
    res.send(results[0].username)
  })
})
/***********wallet************/
// insert user wallet with code added and promise async
app.get('/insertWallet', (req, res) => {
  const param = {
    uid: req.session.uid,
    wname: req.query.wallet
  }
  let sql = `SELECT MAX(wid) as wid FROM wallet`
  queryPromise(sql).then(result => {
    param.wid = result[0].wid + 1;
    param.code = crypto.createHash("sha256").update(param.wname + "//" + param.wid, "utf8").digest("hex").substring(1,8);
    sql = `INSERT INTO wallet (wname, code) VALUES ("${param.wname}", "${param.code}")`
    return queryPromise(sql);
  }).then(none => {
    sql = `INSERT INTO userWallet (uid, wid, nickname)
      VALUES(${param.uid}, ${param.wid}, (SELECT username FROM user WHERE uid=${param.uid}))`
    return queryPromise(sql);
  }).then(none => {
    res.send("Success");
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
// delete user wallet (will cause error)
app.get('/deleteWallet', (req, res) => {
  res.status(501).send("cannot delete wallet");
  /*
  let wname = req.query.wallet
  let uname = req.session.username
  let sql   = `DELETE FROM userWallet WHERE (uid) LIKE
              (SELECT uid FROM user WHERE username = ${uname})
              AND (wid) LIKE
              (SELECT wid FROM wallet WHERE wname = ${wname})`
  connection.query(sql, err => { if(err) throw err })
  sql = `DELETE FROM wallet WHERE (wname) LIKE ${wname}`
  connection.query(sql, err => { if(err) throw err })
    */
  // res.send(`Wallet is deleted!`)
})
// join wallet
app.get('/joinWallet', (req, res) => {
  const idcode = req.query.idcode
  const uid  = req.session.uid
  // should use the wallet code 
  let sql = `INSERT INTO userWallet (uid, wid) VALUES ("${uid}", (SELECT wid FROM wallet WHERE code = "${idcode}"))`
  connection.query(sql, (err, results) => {
    if(err) throw err
    console.log(`create userWallet`)
  })
})
// leave wallet
app.get('/leaveWallet', (req, res) => {
  res.status(501).send("cannot leave wallet");
  /**/
})
// show wallet name
app.get('/showWalletName', (req, res) => {
  const uid = req.session.uid
  let sql = `SELECT wname FROM wallet WHERE wid = (SELECT focusWallet FROM user WHERE uid = "${uid}")`
  connection.query(sql, (err, results) => {
    if(err) throw err
    console.log(results[0].wname)
    res.send(results[0].wname)
  })
})
//switch wallet into null
app.get('/showAllWallet', (req, res) => {
  const uid = req.session.uid
  let sql = `UPDATE user SET focusWallet=null WHERE uid=${uid}`
  queryPromise(sql).then(none => {
    sql = `SELECT wid, wname FROM wallet WHERE wid IN (SELECT wid FROM userWallet WHERE uid = ${uid})`
    return queryPromise(sql);
  }).then(result => {
    res.send(JSON.stringify(result));
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
//switch wallet
app.post('/switchWallet', (req, res) => {
  const param = {
    uid: req.session.uid,
    wid: req.body.wallet
  }
  let sql = `UPDATE user SET focusWallet=${param.wid} WHERE uid=${param.uid}`
  queryPromise(sql).then(none => {
    res.send("Success");
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
// set nickname
app.get('/setNickname', (req, res) => {
  const uid = req.session.uid, wid
  const nick  = req.query.nickname
  let sql = `SELECT focusWallet FROM user WHERE uid=${uid}`
  connection.query(sql, (err, results) => {
    if(err) throw err
    wid = results[0].focusWallet
    sql = `UPDATE userWallet SET nickname='${nick}' WHERE uid=${uid} AND wid=${wid}`
    connection.query(sql, err => {
      if(err) throw err
      res.send("Nickname is updated!")
    })
  })
})
// get member from wallet
app.get('/getMember', (req, res) => {
  let str = ""
  let sql = `SELECT wid FROM wallet WHERE wname = ${wname}`
  connection.query(sql, (err, results) => {
    if(err) throw err
    const wid = results[0].wid
    sql = `SELECT uid FROM userWallet WHERE wid = ${wid}`
    connection.query(sql, (err, results) => {
      if(err) throw err
      for(var i=0; i<results.length; i++) {
        const uid = results[i].uid
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
/***********history************/
// insert history
app.post('/insertHistory', (req, res) => {
  const param = {
    uid: req.session.uid,
    time: req.body.time,
    item: req.body.item,
    money: req.body.money,
    tag: req.body.tag,
    getter: req.session.uid,
    payer: null
  }
  let sql = `INSERT INTO history (hid, time, item, money, tag) 
    VALUES ((SELECT focusWallet FROM user WHERE uid=${param.uid}), "${param.time}", "${param.item}", ${param.money}, "${param.tag}")`
  queryPromise(sql).then(none => {
    sql = `SELECT MAX(hid) AS hid FROM history`
    return queryPromise(sql);
  }).then(result => {
    param.hid = result;
    sql = `SELECT uid from userWallet where wid=(SELECT focusWallet as wallet FROM user WHERE uid=${param.uid}) ORDER BY uid`
    return queryPromise(sql);
  }).then(result => {
    param.alluser = result; 
    param.promises = new Array(result.length);
    for(let i=0; i<result.length; i++) {//parallel
      if(param.uid == result[i].uid) {
        const ratio = 1-1/(result.length*1.0);
        sql = `INSERT INTO userHistory (hid, uid, ratio) VALUES (${param.hid}, ${result[i].uid}, ${ratio})`
        param.promises[i] = queryPromise(sql);
      }
      else {
        const ratio = 1/(result.length*1.0);
        sql = `INSERT INTO userHistory (hid, uid, ratio) VALUES (${param.hid}, ${result[i].uid}, ${ratio})`
        param.promises[i] = queryPromise(sql);
      }
    }
    return Promise.all(param.promises);
  }).then(none => {
    res.send("History is added !");
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
})
// get all item & money if unchecked
app.post('/getHistoryUnchecked', (req, res) => {
  const param = {
    uid: req.session.uid
  }
  let sql = `SELECT focusWallet FROM user WHERE uid=${param.uid}`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT hid, item, money FROM history WHERE (wid=${param.wid} AND checked=0) ORDER BY hid`
    return queryPromise(sql);
  }).then(result => {
    const ret = {
      date: param.date,
      data: result
    }
    res.send(JSON.stringify(ret));
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
// get all item & money from the given date
app.post('/getHistoryDate', (req, res) => {
  const param = {
    uid: req.session.uid,
    date: req.body.date
  }
  let sql = `SELECT focusWallet FROM user WHERE uid=${param.uid}`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT hid, item, money FROM history WHERE (wid=${param.wid} AND time="${param.date}")`
    return queryPromise(sql);
  }).then(result => {
    const ret = {
      date: param.date,
      data: result
    }
    res.send(JSON.stringify(ret));
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
// get total money of each member from the given hostory
app.post('/splitMoney', (req, res) => {
  const param = {
    uid: req.session.uid,
    hid: req.body.hid
  }
  const ret = { date: param.date }
  let sql = `SELECT focusWallet FROM user WHERE uid=${param.uid}`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT sub3.uid, sub3.nickname, sub.totalmoney FROM ((SELECT uid, nickname FROM userWallet WHERE wid=${param.wid}) AS sub3) INNER JOIN ((SELECT userHistory.uid, SUM(userHistory.ratio*sub2.money) AS totalmoney from userHistory INNER JOIN ((SELECT hid, money from history WHERE wid=${param.wid} AND hid IN (${param.hid.toString()})) AS sub2) ON userHistory.hid=sub2.hid GROUP BY userHistory.uid) AS sub) ON sub3.uid=sub.uid ORDER BY sub3.uid`
    return queryPromise(sql);
  }).then(result => {
    ret.data = result;
    res.send(JSON.stringify(ret));
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
// get total money of each member from the given date
app.post('/splitMoneyDate', (req, res) => {
  const param = {
    uid: req.session.uid,
    date: req.body.date
  }
  const ret = { date: param.date }
  let sql = `SELECT focusWallet FROM user WHERE uid=${param.uid}`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT sub3.uid, sub3.nickname, sub.totalmoney FROM ((SELECT uid, nickname FROM userWallet WHERE wid=${param.wid}) AS sub3) INNER JOIN ((SELECT userHistory.uid, SUM(userHistory.ratio*sub2.money) AS totalmoney from userHistory INNER JOIN ((SELECT hid, money from history WHERE (wid=${param.wid} AND time="${param.date}")) AS sub2) ON userHistory.hid=sub2.hid GROUP BY userHistory.uid) AS sub) ON sub3.uid=sub.uid ORDER BY sub3.uid `
    return queryPromise(sql);
  }).then(result => {
    ret.data = result;
    res.send(JSON.stringify(ret));
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
app.post('/confirmSplit', (req, res) => {
  const param = {
    uid: req.session.uid,
    hid: req.body.hid
  }
  let sql = `SELECT focusWallet FROM user WHERE uid=${param.uid}`
  queryPromise(sql).then(result => {
    param.wid = result[0].focusWallet;
    sql = `SELECT userHistory.uid, SUM(userHistory.ratio*sub2.money) AS totalmoney from userHistory INNER JOIN ((SELECT hid, money from history WHERE wid=${param.wid} AND hid IN (${param.hid.toString()})) AS sub2) ON userHistory.hid=sub2.hid GROUP BY uid ORDER BY uid`
    return queryPromise(sql);
  }).then(result => {
    param.promises = new Array(result.length+1);
    for(let i=1; i<result.length; i++) {
      const uid = result[i].uid, totalmoney = result[i].totalmoney*-1
      sql = `UPDATE userWallet SET balance=(SELECT balance FROM (SELECT * FROM userWallet) AS sub WHERE uid=${uid} AND WID=${param.wid} LIMIT 1)+${totalmoney} WHERE uid=${uid} AND wid=${param.wid}`
      param.promises[i] = queryPromise(sql);
    }
    sql = `UPDATE history SET checked=1 WHERE hid IN (${param.hid.toString()})`
    param.promises[result.length] = queryPromise(sql);
    return Promise.all(param.promises);
  }).then(none => {
    res.send("Success")
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
/***********notification************/
function addNotification(wallet, message, tag) {
  if(second === undefined) {
    const sql = `INSERT INTO notification (wid, message) VALUES (${wallet}, ${message})`
    return queryPromise(sql)
  }
  else {
    const sql = `INSERT INTO notification (wid, message, tag) VALUES (${wallet}, ${message}, ${tag})`
    return queryPromise(sql)
  }
}
app.get('/getNotification', (req, res) => {
  const param = {
    uid: req.session.uid
  }
  let sql = `SELECT message FROM notification where wid=(SELECT focusWallet FROM user WHERE uid=${param.uid}) ORDER BY idx DESC`
  queryPromise(sql).then(result => {
    res.send(result.)
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
/***********debug************/
// showAll user
app.get('/showAll-user', (req, res) => {
  let sql = `SELECT COUNT(*) rows FROM user`
  let count = 0
  connection.query(sql, (err, results) => {
    if(err) throw err
    count = results[0].rows
  })
  sql = `SELECT * FROM user`
  let str = ""
  connection.query(sql, (err, results) => {
    if(err) throw err
    for(let i=0; i<count; i++) 
      // res.send(`There are tables: ${results[i].username}`)
      str = str + `user${i+1}: ${results[i].username}, password: ${results[i].password} <br>`
    res.send(str)
  })
})
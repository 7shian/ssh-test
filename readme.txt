// --------- user signup -----------
//
// app.get('./signupUser')
//
// input data : (mail, password)
// setup info : (username: default->mail
//               mail:     mail
//               password: password)
// return : Success / Fail
// ---------------------------------
// to-do : mail should be checked if it's unique
//         should tell the front-end if it's success

// --------- user login ------------
//
// app.get('./loginUser')
// 
// input data : (mail/username, password)
// judge : (mail == mail OR username == username) 
            AND password == password
// return : Success / Fail
// ---------------------------------
// to-do : 

// --------- wallet create ---------
//
// app.get('./insertWallet')
// 
// input data : (walletname)
// setup info : (walletname: walletname
//               idcode: auto-generate)
// function : userWallet setup
// return : Success / Fail
// ---------------------------------
// to-do : is the wallet name unique?

// --------- wallet delete ---------
//
// app.get('./deleteWallet')
// 
// input data : (walletname)
// function   : delete the userWallet / userHistory
// return : Success / Fail
// ---------------------------------
// to-do : front-end wallet delete?
//         delete wallet only if you clean the receipt

// --------- wallet switch ---------
//
// app.get('./switchWallet')
// 
// input data  : walletname
// update info : focusWallet at user
// return : Success / Fail
// ---------------------------------
// to-do : 

// --------- wallet join -----------
//
// app.get('./joinWallet')
// 
// input data : wallet_idcode
// setup info : userWallet setup
// return : Success / Fail
// ---------------------------------
// to-do : 

// -------- history create ---------
//
// app.get('./insertHistory')
// 
// input data  : (time : date, 
//                item : item name,
//                money: total amount of this consumption,
//                tag  : default->item name)
// function : history setup, 
//            userHistory setup
// return : Success / Fail
// ---------------------------------
// to-do : setup history.wid
// --------set nickname-----------
//
// app.get('setNickname')
//
// input data: {nickname: (string)}
// additional:  user should login
//              user should be in wallet
// return:    Nickname is updated(success)
// --------------------------------
// to-do: merge nickname and money
//
//---------get History from Day-----------
//
// app.get('getHistoryDay')
//
// input data: {date: (date)}
// additional:  user should login
//              user should be in wallet
// return:    {
//            date: (date)
//            result: [{
//                      item: (string),
//                      money: (double)
//                      },...]
//            }
// --------------------------------
// to-do: none
//
// --------split Money from Day-----------
//
// app.get('splitMoneyDay')
//
// input data: {date: (date)}
// additional:  user should login
//              user should be in wallet
// return:    {
//              date: (date),
//              data: [{
//                      user: (uid),
//                      nickname: (string),
//                      money: (double)
//                      },...]
//            }
// --------------------------------
// to-do: merge nickname and money
//

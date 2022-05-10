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
//---------split Money 1-----------
//
// app.get('splitMoney1')
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
// --------split Money 2-----------
//
// app.get('splitMoney2')
//
// input data: {date: (date)}
// additional:  user should login
//              user should be in wallet
// return:    {
//            date: (date)
//            nickname: [{
//                      user: (uid),
//                      nickname: (string)
//                      },...]
//            money: [{
//                      user: (uid),
//                      money: (double)
//                      },...]
//             }
// --------------------------------
// to-do: merge nickname and money
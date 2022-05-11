$(document).ready(function() {
  // open side bar
  $('#__Page__menu').click((event) => { 
    $.get('./showWalletName', {}, (data) => {
      $('#__Page__menu__head_word').text(data) 
    })
  })
  // switch to the 錢包總覽
  $('#__Page__menu__page5').click((event) => {
    $.get('./showWallet', {}, (data) => {
      /*
        #__overview__header__bar 這裡要顯示錢包並對照名字跟id
        把接受的array(data)變成全域變數，html綁定index
        然後那個區塊的文字就是array[index].wname
        回傳就是array[index].wid
      */
    })
  })
  // switch to 分帳 page
  $('#__Page__menu__page2').click((event) => { 
    $.get('./getHistoryDate', {}, (data) => {
      /*
        得到array(data)
          然後那個區塊的文字就是array[index].time array[index].item array[index].money
        或是
          array(data)就是字串，區塊的文字就是array[index].str
        寫在 #__Page6__bill__container 下的 #delete_id(index)
      */
    })
  })
  // 結算 page
  $('#__Page6__word__containerid').click((event) => {
    /*
      如何選到 #__Page6__bill__container 下的 #delete_id(index) 是不是被選擇
      date要怎麼拿到 => 在 #__Page6__bill__container 下的 #delete_id(index) 
      post => splitMoneyDate
      回傳標題 date item money    => $(#__Page18__bill_word).text(...)
      回傳分帳 username 需要付的錢 => #__Page18__personcheck__container 下的 #delete_id(index)
              username 需要付的錢
    */
    // $.post('./splitMoneyDate', {date})
    /*
    splitMoney: 
    輸入 hid陣列 (hid可從getHistoryUnchecked獲得)
    回傳 所有成員的 (uid, nickname, 欠錢(>0為欠錢))
    */
    // $.post('./splitMoney', {date})
  })
  // 確認分帳
  $('#__Page18__word__containerid2').click((event) => {
    /*
      改變指定的uid和history中是否繳清的狀態
    */
  })
  // 確認記帳  205行沒有定義id
  $('#').click((event) => {
    $.get('./insertHistory', {
      time: $('#').val(),
      item: $('#').val(),
      money: $('#').val()
    })
  })
  // 選擇錢包之後 notification 需要展示出來
  $('#').click((event) => {
    $.get('./getNotification', {}, (data) => { // this is not checked

    })
  })
})
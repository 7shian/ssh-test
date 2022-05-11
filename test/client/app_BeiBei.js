$(document).ready(function() {
  // open side bar
  $('#__Page__menu').click((event) => { 
    $.get('./showWalletname'), {}, (data) => {
      $('#__Page__menu__head_word').text(data) // walletname is not determined 
    }
  })
  // switch to split page
  $('#__Page__menu__page2').click((event) => { // split name is not determined 
    $.get('./getHistory', {}, (data) => {
    })
  })
  
})
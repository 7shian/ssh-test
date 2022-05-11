$(document).ready(function() {
  // open side bar
  $('#__Page__menu').click((event) => { 
    $.get('./showWalletName', {}, (data) => {
      $('#__Page__menu__head_word').text(data) 
    })
  })
  // switch to split page
  $('#__Page__menu__page2').click((event) => { 
    $.get('./getHistory', {}, (data) => {
    })
  })
  
})
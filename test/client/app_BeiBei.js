$(document).ready(function() {
  // open side bar
  $('#sidebar').click((event) => { // sidebar name is not determined
    $.get('./showWalletname'), {}, (data) => {
      $('#walletName').text(data) // walletname is not determined 
    }
  })
  // switch to split page
  $('#split').click((event) => { // split name is not determined 
    $.get('./getHistory', {}, (data) => {
      $('#__Page6__bill__container').text(data)
    })
  })
  
})
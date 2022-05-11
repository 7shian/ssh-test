$(document).ready(function() {
  // insert a new user
  $('#form-normal button[type="button"]').click((event) => {
    event.preventDefault()
    $.get('./signupUser', {
      mail: $('#form-normal input[name=email]').val(),
      password: $('#form-normal input[name=pwd]').val(),
    }, (data) => {
      console.log(data)
      $.get('./loginUser', {
        mail: $('#form-normal input[name=email]').val(),
        password: $('#form-normal input[name=pwd]').val(),
      }, (data) => {
        console.log(data)
        $.get('./showUsername', {}, (data) => {
          $('#username').text(data) // this temporary id
        })
      })
    })
  })
  // create a new wallet
  $('#new-wallet input[type="submit"]').click((event) => {
    // event.preventDefault()
    $.get('./insertWallet', {
      wallet: $('#new-wallet input[name="Wallet"]').val(),
    })
    // wallet doesn't show
    $.get('./showWallet', {}, (data) => {
      console.log(data)
    })
  })
  // join a exist wallet
  $('#join-wallet input[type="submit"]').click((event) => {
    $.get('./joinWallet', {
      idcode: $('#join-wallet input[name="IDcode"]').val(),
    })
    $.get('./showWallet', {}, (data) => {
      console.log(data)
    })
  })
})


// document.addEventListener("DOMContentLoaded", function() {
//   // signup a new user
//   document.querySelector('#form-normal button[type="button"]').onclick = (event) => {
//     // event.preventDefault()
//     console.log(document.querySelector('#form-normal input[name=email]').value)
//     fetch('./signupUser', {
//       mail: document.querySelector('#form-normal input[name=email]').value,
//       password: document.querySelector('#form-normal input[name=pwd]').value,
//     }).then(() => {
//       return (fetch(`./loginUser`, {
//         mail: document.querySelector('#form-normal input[name=email]').value,
//         password: document.querySelector('#form-normal input[name=pwd]').value,
//       }));
//     }).then((data) => {
//       console.log(data)
//       return (fetch('./showUsername'));
//     }).then((data) => data.text()).then((data) => {
//         document.querySelector('#username').textContent = data;
//     })
//   }
// })

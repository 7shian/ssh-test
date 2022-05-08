$(document).ready(function() {
  // insert a new user
  $('#signup-user-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./signupUser', {
      username: $('#signup-user-form input[name=username]').val(),
      password: $('#signup-user-form input[name=password]').val(),
    }, (data) => {
      $('#signup-user-output').html(data)
    })
  })
  // user log in 
  $('#login-user-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./loginUser', {
      username: $('#login-user-form input[name=username]').val(),
      password: $('#login-user-form input[name=password]').val(),
    }, (data) => {
      $('#login-user-output').html(data)
    })
  })
  // show all users
  $('#showAll-user-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./showAll-user', {
    }, (data) => {
      $('#showAll-user-output').html(data)
    })
  })
  // insert a new wallet under the user
  $('#insert-wallet-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./insertWallet', {
      wallet: $('#insert-wallet-form input[name=wallet]').val(),
    }, (data) => {
      $('#insert-wallet-output').html("here")
      $('#insert-wallet-output').html(data)
    })
  })
})
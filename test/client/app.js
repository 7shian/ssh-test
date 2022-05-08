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
  // get data from date
  document.querySelector('#get-data-form button[type="submit"]').onclick = (event) => {
    event.preventDefault();
    window.fetch('/checkItems', {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({
        date: document.querySelector("#get-data-form [name=wallet]").value
      })
    }).then(function(response) {
      if (response.status >= 200 && response.status < 300)
        return response;
      else
        throw new Error(response.status +":"+response.statusText);
    }).then(response => response.json()).then(function(response) {
      let str = "date: " + response.date + "<br>";
      Object.entries(response).forEach(([key, value]) => {
        str += `\"${key}\":\"${value}\"<br>`;
      });
      document.getElementById("get-data-output").innerHTML = str;
    }).catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
  }
})
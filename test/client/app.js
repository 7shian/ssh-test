$(document).ready(function() {
  // insert a new user
  $('#signup-user-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./signupUser', {
      mail: $('#signup-user-form input[name=mail]').val(),
      password: $('#signup-user-form input[name=password]').val(),
    }, (data) => {
      $('#signup-user-output').html(data)
    })
  })
  // user log in 
  $('#login-user-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./loginUser', {
      mail: $('#login-user-form input[name=mail]').val(),
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
      $('#insert-wallet-output').html(data)
    })
  })
  // delete the wallet 
  $('#delete-wallet-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./deleteWallet', {
      wallet: $('#delete-wallet-form input[name=wallet]').val(),
    }, (data) => {
      $('#delete-wallet-output').html(data)
    })
  })
  // get data from date
  document.querySelector('#get-data-form button[type="submit"]').onclick = (event) => {
    event.preventDefault();
    window.fetch('/splitMoney1', {
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
      let str;
      Object.entries(response).forEach(([key, value]) => {
        str += `\"${key}\":\"${value}\"<br>`;
      });
      document.getElementById("get-data-output").innerHTML = str;
    }).catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
  }
  // insert the receipt to history
  $('#record-receipt-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./insertHistory', {
      money: $('#record-receipt-form input[name=money]').val(),
      item:  $('#record-receipt-form input[name=item]').val(),
      time:  $('#record-receipt-form input[name=time]').val(),
    }, (data) => {
      $('#record-receipt-output').html(data)
    })
  })
  // join wallet
  $('#join-wallet-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./joinWallet', {
      wallet: $('#join-wallet-form input[name=wallet]').val(),
    }, (data) => {
      $('join-wallet-output').html(data)
    })
  })
  // get member from wallet
  $('#get-member-form button[type="submit"]').click((event) => {
    event.preventDefault()
    $.get('./getMember', {
      wname: $('#get-member-form input[name=wallet]').val(),
    }, (data) => {
      $('#get-member-output').html(data)
    })
  })
  $('#add-history-form button[type="submit"]').click((event) => {
    event.preventDefault()
    window.fetch('/insertHistory', {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({
        time: document.querySelector("#add-history-form [name=time]").value,
        item: document.querySelector("#add-history-form [name=item]").value,
        money: document.querySelector("#add-history-form [name=money]").value,
        tag: document.querySelector("#add-history-form [name=tag]").value
      })
    }).then(function(response) {
      if (response.status >= 200 && response.status < 300)
        return response;
      else
        throw new Error(response.status +":"+response.statusText);
    }).then(response => response.text()).then(function(response) {
      document.getElementById("add-history-output").innerHTML = response;
    }).catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
  })
})
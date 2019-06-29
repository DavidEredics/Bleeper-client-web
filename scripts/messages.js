/* global showError */

function showMessage(messages) {
  if (messages.length >= 0) {
    let messagesTable = '<table id="table-messages" border="1">';
    messagesTable += '<tr><td>Date</td><td>From</td><td>Text</td></tr>';
    messagesTable += '</table>';
    document.getElementById('div-messages').innerHTML = messagesTable;
    Object.keys(messages).forEach((message) => {
      const messagesRow = document.createElement('tr');
      messagesRow.setAttribute('id', messages[message]._id);
      messagesRow.innerHTML += `<td>${messages[message].Date}</td>`;
      messagesRow.innerHTML += `<td>${messages[message].from}</td>`;
      messagesRow.innerHTML += `<td>${messages[message].text}</td>`;
      document.getElementById('table-messages').appendChild(messagesRow);
    });
  }
}

function readMessages() {
  const serverUrl = `${sessionStorage.serverUrl}/message/read`;

  fetch(serverUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      showError(`status: ${response.status}\nstatusText: ${response.statusText}`);
    }
    return response.json();
  }).then((responseData) => {
    showMessage(responseData);
  }).catch((error) => {
    showError(`Can not connect to server <br> ${error}`);
  });
}

if (sessionStorage.token
  && sessionStorage.token_exp * 1000 >= Date.now()
  && sessionStorage.token_iat * 1000 <= Date.now() && sessionStorage.serverUrl) {
  readMessages();
} else {
  window.location.replace('login.html');
}

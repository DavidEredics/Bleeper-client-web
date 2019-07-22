/* global showError */

const { serverUrl } = localStorage;

function showMessage(messages) {
  if (messages !== null && messages.length >= 0) {
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
  fetch(`${serverUrl}/message/read`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      showError(`status: ${response.status}\nstatusText: ${response.statusText}`);
    }
    if (response.status === 204) {
      showError('No messages');
      return null;
    }
    return response.json();
  }).then((responseData) => {
    showMessage(responseData);
  }).catch((error) => {
    showError(`Can not connect to server <br> ${error}`);
  });
}

function sendMessage() {
  const inputs = document.getElementById('sendMessage').getElementsByTagName('input');
  const to = inputs.to.value;
  const text = inputs.text.value;
  const messageData = { to, text };

  fetch(`${serverUrl}/message/send`, {
    method: 'POST',
    body: JSON.stringify(messageData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.token}`,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    showError(`status: ${response.status}\nstatusText: ${response.statusText}`);
    return null;
  }).then((responseData) => {
    if (responseData !== null && responseData !== undefined) {
      if (Object.prototype.hasOwnProperty.call(responseData, 'Success')) {
        showError(responseData.Success);
      } else if (Object.prototype.hasOwnProperty.call(responseData, 'Error')) {
        showError(responseData.Error);
      }
    } else {
      showError('Can not connect to server');
    }
  }).catch((error) => {
    showError(`Can not connect to server <br> ${error}`);
  });
}

if (sessionStorage.token
  && sessionStorage.token_exp * 1000 >= Date.now()
  && localStorage.serverUrl) {
  readMessages();

  document.getElementById('sendBtn').addEventListener('click', () => {
    sendMessage();
  });
} else {
  window.location.replace('login.html');
}

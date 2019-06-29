/* global showError */

window.onload = document.getElementById('loginBtn').addEventListener('click', () => {
  const serverUrl = document.getElementById('serverUrl').value;
  if (serverUrl !== undefined && serverUrl !== '') {
    const inputs = document.getElementById('login').getElementsByTagName('input');
    const name = inputs.name.value;
    const password = inputs.password.value;
    const loginData = { name, password };

    fetch(`${serverUrl}/user/auth`, {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      showError(`status: ${response.status}\nstatusText: ${response.statusText}`);
      return null;
    }).then((responseData) => {
      if (responseData !== null && responseData !== undefined) {
        if (Object.prototype.hasOwnProperty.call(responseData, 'authToken')) {
          sessionStorage.setItem('serverUrl', serverUrl);
          sessionStorage.setItem('token', responseData.authToken.token);
          sessionStorage.setItem('token_iat', responseData.authToken.iat);
          sessionStorage.setItem('token_exp', responseData.authToken.exp);
          window.location.href = 'messages.html';
        } else if (Object.prototype.hasOwnProperty.call(responseData, 'Error')) {
          showError(responseData.Error);
        }
      } else {
        showError('Can not connect to server');
      }
    }).catch((error) => {
      showError(`Can not connect to server <br> ${error}`);
    });
  } else {
    showError('Server Url not provided!');
  }
});

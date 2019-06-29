if (sessionStorage.token
  && sessionStorage.token_exp * 1000 >= Date.now()
  && sessionStorage.token_iat * 1000 <= Date.now()) {
  document.getElementById('a-login').style.display = 'none';
  document.getElementById('a-messages').style.display = 'block';
} else {
  document.getElementById('a-login').style.display = 'block';
  document.getElementById('a-messages').style.display = 'none';
}

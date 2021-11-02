const ACCESS_TOKEN = 'accessToken';

class Storage {
  setToken(access_token) {
    localStorage.setItem(ACCESS_TOKEN, access_token);
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  removeToken() {
    localStorage.removeItem(ACCESS_TOKEN);
  }
}

export default new Storage();

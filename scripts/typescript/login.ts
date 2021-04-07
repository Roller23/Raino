import io from 'socket.io-client';
import { Global } from './global';
import { authSocket, fadeOut, get, getAll, parseJson, request, validEmail } from './utils'

(async () => {

  const remote = require('electron').remote;
  const win = remote.getCurrentWindow();

  const getI = (s: string) => <HTMLInputElement>get(s);
  
  let loggingIn: boolean = true;
  let authInProgress: boolean = false;

  showInputs();

  if (localStorage.token && localStorage.tokenSelector) {
    hideInputs();
    console.log('signing in with token')
    Global.token = localStorage.token;
    Global.tokenSelector = localStorage.tokenSelector;
    get('#send-login-form')!.classList.add('authorizing');
    initSocketAuth();
  }

  function showInputs() {
    authInProgress = false;
    const wrap = get('.input-wrapper')!;
    wrap.style.height = `${wrap.scrollHeight}px`;
  }

  function hideInputs() {
    authInProgress = true;
    get('.input-wrapper')!.style.height = '0px';
  }

  function toggleForm(self: HTMLElement): void {
    const wrapper = get('.form-nickname-wrapper')!;
    const swapIn = get('.swap-wrap .in')!;
    const swapUp = get('.swap-wrap .up')!;
    loggingIn = !loggingIn;
    if (!loggingIn) {
      wrapper.style.height = wrapper.scrollHeight + 'px';
      swapIn.style.height = '0%';
      swapUp.style.opacity = '1';
      self.innerText = 'take me back';
      return;
    }
    wrapper.style.height = '0px';
    swapIn.style.height = '100%';
    swapUp.style.opacity = '0';
    self.innerText = 'sign up';
  }

  function initSocketAuth() {
    hideInputs();
    Global.socket = io('https://raino-backend.glitch.me');
    Global.socket.on('connected', () => {
      authSocket();
    });
    Global.socket.on('authenticated', async () => {
      get('#send-login-form')!.classList.remove('signing', 'authorizing');
      get('#send-login-form')!.classList.add('success');
      await fadeOut(get('.login-container')!, 400);
      win.setFullScreen(true);
    });
    Global.socket.on('auth denied', () => {
      // TODO: get a new token
      showInputs();
      get('#send-login-form')!.classList.remove('signing', 'authorizing');
      alert('Could not sign in! Try again');
    });
  }

  async function register() {
    if (authInProgress) return;
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    const nickname: string = getI('#form-nickname').value.trim();
    if (!email) {
      return alert('Email cannot be empty');
    }
    if (!validEmail(email)) {
      return alert('Invalid email address');
    }
    if (password.length < 3) {
      return alert('Password too short');
    }
    if (password.length > 100) {
      return alert('Password too long');
    }
    if (!nickname) {
      return alert('Nickname cannot be empty');
    }
    if (nickname.length > 20) {
      return alert('Nickname can be maximum 20 characters');
    }
    const data = {email, password, nickname};
    const url = 'https://raino-backend.glitch.me/register/';
    const json = await request('POST', url, data);
    const res = parseJson(json);
    if (typeof res !== 'object') {
      return alert('Server error!');
    }
    if (!res.success) {
      // TODO: convert msg to something more friendly
      return alert(res.msg);
    }
    alert('Success! You can now sign in');
    toggleForm(get('#signup-btn')!);
  }

  async function login() {
    if (authInProgress) return;
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    if (!email) {
      return alert('Email cannot be empty');
    }
    if (!password) {
      return alert('Password cannot be empty');
    }
    if (!validEmail(email)) {
      return alert('Invalid email address');
    }
    if (password.length < 3 || password.length > 100) {
      return alert('Password too long or short');
    }
    get('#send-login-form')!.classList.add('signing');
    hideInputs();
    const data = {email, password};
    const url = 'https://raino-backend.glitch.me/login/';
    const json = await request('POST', url, data);
    const res = parseJson(json);
    if (res === null) {
      showInputs();
      get('#send-login-form')!.classList.remove('signing');
      return alert('Server error!');
    }
    if (!res.success) {
      showInputs();
      // TODO: convert msg to something more friendly
      return alert(res.msg);
    }
    get('#send-login-form')!.classList.add('authorizing');
    localStorage.token = res.token;
    localStorage.tokenSelector = res.selector;
    Global.token = res.token;
    Global.tokenSelector = res.selector;
    if (Global.socket && Global.socket.connected) {
      return authSocket();
    }
    if (Global.socket) {
      Global.socket.disconnect();
    }
    initSocketAuth();
  }

  get('#signup-btn')!.addEventListener('click', function(this: HTMLElement, e: Event): void {
    toggleForm(this);
  });

  get('#send-login-form')!.addEventListener('click', (e: Event) => {
    if (!loggingIn) {
      return register();
    }
    login();
  });

  getAll('#form-email, #form-password').forEach(input => {
    input.addEventListener('keyup', e => {
      if (e.code !== 'Enter') return;
      login();
    });
  });

  get('#logout')!.addEventListener('click', async e => {
    Global.token = null;
    Global.tokenSelector = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenSelector');
    // await request('POST', 'https://raino-backend.glitch.me/logout/');
    window.location.reload();
  });

})();
import io from 'socket.io-client';
import { registerChatEvents } from './chat';
import { Global } from './global';
import { authSocket, fadeOut, get, getAll, parseJson, popup, request, validEmail } from './utils'
import * as fs from 'fs'
import { showWelcomeScreen } from './welcome';

(async () => {

  // set a random splashscreen
  const splashScreens: string[] = fs.readdirSync('./splash_screens/');
  const splashScreen: string = splashScreens[Math.floor(Math.random() * splashScreens.length)];
  get('.login-container')!.style.backgroundImage = `url(./splash_screens/${splashScreen})`;

  const remote = require('electron').remote;
  const win = remote.getCurrentWindow();

  const getI = (s: string) => <HTMLInputElement>get(s);
  
  let loggingIn: boolean = true;
  let authInProgress: boolean = false;
  let registerInProgress: boolean = false;

  const button = get('#send-login-form')!;
  const buttonText = button.querySelector<HTMLElement>('.text')!;
  let oldButtonText = buttonText.innerText;

  showInputs();

  if (localStorage.token && localStorage.tokenSelector) {
    hideInputs();
    console.log('signing in with token')
    Global.token = localStorage.token;
    Global.tokenSelector = localStorage.tokenSelector;
    buttonText.innerText = 'Authorizing...';
    initSocketAuth();
  }

  function showInputs() {
    authInProgress = false;
    const wrap = get('.login-container .input-wrapper')!;
    wrap.style.height = `${wrap.scrollHeight}px`;
  }

  function hideInputs() {
    authInProgress = true;
    get('.login-container .input-wrapper')!.style.height = '0px';
  }

  function toggleForm(self: HTMLElement): void {
    const wrapper = get('.form-nickname-wrapper')!;
    const swapIn = get('.swap-wrap .in')!;
    const swapUp = get('.swap-wrap .up')!;
    loggingIn = !loggingIn;
    if (!loggingIn) {
      get('.login-container .input-wrapper')!.style.height = 'auto';
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
    Global.socket = io('https://rainoapp.glitch.me');
    Global.socket.on('connected', () => {
      authSocket();
    });
    Global.socket.on('authenticated', async () => {
      registerChatEvents();
      buttonText.innerText = 'Success!';
      await fadeOut(get('.login-container')!, 400);
      // win.setFullScreen(true); TODO
      if (localStorage.welcomeScreenShown !== 'true') {
        await showWelcomeScreen()
        localStorage.welcomeScreenShown = 'true';
      }
    });
    Global.socket.on('auth denied', () => {
      // TODO: get a new token
      showInputs();
      buttonText.innerText = 'Continue';
      popup('Could not sign in! Try again');
    });
  }

  async function register() {
    if (authInProgress || registerInProgress) return;
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    const nickname: string = getI('#form-nickname').value.trim();
    if (!email) {
      return popup('Email cannot be empty');
    }
    if (!validEmail(email)) {
      return popup('Invalid email address');
    }
    if (password.length < 3) {
      return popup('Password too short');
    }
    if (password.length > 100) {
      return popup('Password too long');
    }
    if (!nickname) {
      return popup('Nickname cannot be empty');
    }
    if (nickname.length > 20) {
      return popup('Nickname can be maximum 20 characters');
    }
    buttonText.innerText = 'Registering...';
    registerInProgress = true;
    const data = {email, password, nickname};
    const url = 'https://rainoapp.glitch.me/register/';
    const json = await request('POST', url, data);
    const res = parseJson(json);
    registerInProgress = false;
    buttonText.innerText = 'Continue';
    if (res === null) {
      return popup('Server error!');
    }
    if (!res.success) {
      // TODO: convert msg to something more friendly
      return popup(res.msg);
    }
    popup('Success! You can now sign in');
    toggleForm(get('#signup-btn')!);
  }

  async function login() {
    if (authInProgress || registerInProgress) return;
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    if (!email) {
      return popup('Email cannot be empty');
    }
    if (!password) {
      return popup('Password cannot be empty');
    }
    if (!validEmail(email)) {
      return popup('Invalid email address');
    }
    if (password.length < 3 || password.length > 100) {
      return popup('Password too long or short');
    }
    hideInputs();
    buttonText.innerText = 'Signing in...';
    const data = {email, password};
    const url = 'https://rainoapp.glitch.me/login/';
    const json = await request('POST', url, data);
    const res = parseJson(json);
    if (res === null) {
      buttonText.innerText = 'Continue';
      showInputs();
      return popup('Server error!');
    }
    if (!res.success) {
      buttonText.innerText = 'Continue';
      showInputs();
      // TODO: convert msg to something more friendly
      return popup(res.msg);
    }
    buttonText.innerText = 'Authorizing...';
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
    // await request('POST', 'https://rainoapp.glitch.me/logout/');
    window.location.reload();
  });

  button.addEventListener('mouseenter', function(this: HTMLElement, e: Event) {
    if (registerInProgress || authInProgress) return;
    oldButtonText = buttonText.innerText;
    buttonText.innerText = 'To infinity and beyond!';
  });

  button.addEventListener('mouseleave', function(this: HTMLElement, e: Event) {
    if (registerInProgress || authInProgress) return;
    buttonText.innerText = oldButtonText;
  });

})();
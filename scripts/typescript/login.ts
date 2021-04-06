import io from 'socket.io-client';
import { Global } from './global';
import { authSocket, get, parseJson, request, validEmail } from './utils'

(async () => {

  const getI = (s: string) => <HTMLInputElement>get(s);
  
  let loggingIn: boolean = true;

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

  async function register() {
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    const nickname: string = getI('#form-nickname').value.trim();
    if (!validEmail(email)) {
      return alert('Invalid email address');
    }
    if (password.length < 3 || password.length > 100) {
      return alert('Password too long or short');
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
    const email: string = getI('#form-email').value.trim();
    const password: string = getI('#form-password').value;
    if (!validEmail(email)) {
      return alert('Invalid email address');
    }
    if (password.length < 3 || password.length > 100) {
      return alert('Password too long or short');
    }
    const data = {email, password};
    const url = 'https://raino-backend.glitch.me/login/';
    get('#send-login-form')!.classList.add('signing');
    const json = await request('POST', url, data);
    const res = parseJson(json);
    if (res === null) {
      get('#send-login-form')!.classList.remove('signing');
      return alert('Server error!');
    }
    get('#send-login-form')!.classList.add('authorizing');
    if (!res.success) {
      get('#send-login-form')!.classList.remove('signing', 'authorizing');
      // TODO: convert msg to something more friendly
      return alert(res.msg);
    }
    Global.token = res.token;
    Global.tokenSelector = res.selector;
    if (Global.socket && Global.socket.connected) {
      return authSocket();
    }
    if (Global.socket) {
      Global.socket.disconnect();
    }
    Global.socket = io('https://raino-backend.glitch.me');
    Global.socket.on('connected', () => {
      authSocket();
    });
    Global.socket.on('authenticated', () => {
      get('#send-login-form')!.classList.remove('signing', 'authorizing');
      get('#send-login-form')!.classList.add('success');
      // TODO: close the login page and display chat
    });
    Global.socket.on('auth denied', () => {
      // TODO: get a new token
      get('#send-login-form')!.classList.remove('signing', 'authorizing');
      alert('Could not sign in! Try again');
    });
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

})();
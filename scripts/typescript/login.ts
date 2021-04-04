(async () => {
  
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
    const $ = (s: string) => <HTMLInputElement>get(s); // might make it global later
    const email: string = $('#form-email').value;
    const password: string = $('#form-password').value;
    const nickname: string = $('#form-nickname').value;
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
    const $ = (s: string) => <HTMLInputElement>get(s);
    const email: string = $('#form-email').value;
    const password: string = $('#form-password').value;
    const data = {email, password};
    const url = 'https://raino-backend.glitch.me/login/';
    const json = await request('POST', url, data);
    const res = parseJson(json);
    if (res === null) {
      return alert('Server error!');
    }
    if (!res.success) {
      // TODO: convert msg to something more friendly
      return alert(res.msg);
    }
    alert('Success!\n...\nwhat now');
  }

  get('#signup-btn')!.on('click', function(this: HTMLElement, e: Event): void {
    toggleForm(this);
  });

  get('#send-login-form')!.on('click', (e: Event) => {
    if (!loggingIn) {
      return register();
    }
    login();
  });

})();
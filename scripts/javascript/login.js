"use strict";
(async () => {
    let loggingIn = true;
    function toggleForm(self) {
        const wrapper = get('.form-nickname-wrapper');
        const swapIn = get('.swap-wrap .in');
        const swapUp = get('.swap-wrap .up');
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
        const $ = (s) => get(s); // might make it global later
        const email = $('#form-email').value;
        const password = $('#form-password').value;
        const nickname = $('#form-nickname').value;
        const data = { email, password, nickname };
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
        toggleForm(get('#signup-btn'));
    }
    async function login() {
        const $ = (s) => get(s);
        const email = $('#form-email').value;
        const password = $('#form-password').value;
        const data = { email, password };
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
    get('#signup-btn').on('click', function (e) {
        toggleForm(this);
    });
    get('#send-login-form').on('click', (e) => {
        if (!loggingIn) {
            return register();
        }
        login();
    });
})();

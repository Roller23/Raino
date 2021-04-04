"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const global_1 = require("./global");
const utils_1 = require("./utils");
(async () => {
    let loggingIn = true;
    function toggleForm(self) {
        const wrapper = utils_1.get('.form-nickname-wrapper');
        const swapIn = utils_1.get('.swap-wrap .in');
        const swapUp = utils_1.get('.swap-wrap .up');
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
        const $ = (s) => utils_1.get(s); // might make it global later
        const email = $('#form-email').value;
        const password = $('#form-password').value;
        const nickname = $('#form-nickname').value;
        const data = { email, password, nickname };
        const url = 'https://raino-backend.glitch.me/register/';
        const json = await utils_1.request('POST', url, data);
        const res = utils_1.parseJson(json);
        if (typeof res !== 'object') {
            return alert('Server error!');
        }
        if (!res.success) {
            // TODO: convert msg to something more friendly
            return alert(res.msg);
        }
        alert('Success! You can now sign in');
        toggleForm(utils_1.get('#signup-btn'));
    }
    async function login() {
        const $ = (s) => utils_1.get(s);
        const email = $('#form-email').value;
        const password = $('#form-password').value;
        const data = { email, password };
        const url = 'https://raino-backend.glitch.me/login/';
        const json = await utils_1.request('POST', url, data);
        const res = utils_1.parseJson(json);
        if (res === null) {
            return alert('Server error!');
        }
        if (!res.success) {
            // TODO: convert msg to something more friendly
            return alert(res.msg);
        }
        global_1.Global.token = res.token;
        if (global_1.Global.socket && global_1.Global.socket.connected) {
            return utils_1.authSocket();
        }
        global_1.Global.socket = socket_io_client_1.default('https://raino-backend.glitch.me');
        global_1.Global.socket.on('connected', () => {
            utils_1.authSocket();
        });
        global_1.Global.socket.on('authenticated', () => {
            console.log('yay auth successful');
        });
        alert('Success!\n...\nwhat now');
    }
    utils_1.get('#signup-btn').addEventListener('click', function (e) {
        toggleForm(this);
    });
    utils_1.get('#send-login-form').addEventListener('click', (e) => {
        if (!loggingIn) {
            return register();
        }
        login();
    });
})();

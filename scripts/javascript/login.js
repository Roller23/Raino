"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const chat_1 = require("./chat");
const global_1 = require("./global");
const utils_1 = require("./utils");
const fs = __importStar(require("fs"));
(async () => {
    const splashScreens = fs.readdirSync('./splash_screens/');
    const splashScreen = splashScreens[Math.floor(Math.random() * splashScreens.length)];
    utils_1.get('.login-container').style.backgroundImage = `url(./splash_screens/${splashScreen})`;
    const remote = require('electron').remote;
    const win = remote.getCurrentWindow();
    const getI = (s) => utils_1.get(s);
    let loggingIn = true;
    let authInProgress = false;
    let registerInProgress = false;
    const button = utils_1.get('#send-login-form');
    const buttonText = button.querySelector('.text');
    let oldButtonText = buttonText.innerText;
    showInputs();
    if (localStorage.token && localStorage.tokenSelector) {
        hideInputs();
        console.log('signing in with token');
        global_1.Global.token = localStorage.token;
        global_1.Global.tokenSelector = localStorage.tokenSelector;
        buttonText.innerText = 'Authorizing...';
        initSocketAuth();
    }
    function showInputs() {
        authInProgress = false;
        const wrap = utils_1.get('.login-container .input-wrapper');
        wrap.style.height = `${wrap.scrollHeight}px`;
    }
    function hideInputs() {
        authInProgress = true;
        utils_1.get('.login-container .input-wrapper').style.height = '0px';
    }
    function toggleForm(self) {
        const wrapper = utils_1.get('.form-nickname-wrapper');
        const swapIn = utils_1.get('.swap-wrap .in');
        const swapUp = utils_1.get('.swap-wrap .up');
        loggingIn = !loggingIn;
        if (!loggingIn) {
            utils_1.get('.login-container .input-wrapper').style.height = 'auto';
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
        global_1.Global.socket = socket_io_client_1.default('https://raino-backend.glitch.me');
        global_1.Global.socket.on('connected', () => {
            utils_1.authSocket();
        });
        global_1.Global.socket.on('authenticated', async () => {
            chat_1.registerChatEvents();
            buttonText.innerText = 'Success!';
            await utils_1.fadeOut(utils_1.get('.login-container'), 400);
            // win.setFullScreen(true); TODO
        });
        global_1.Global.socket.on('auth denied', () => {
            // TODO: get a new token
            showInputs();
            buttonText.innerText = 'Continue';
            alert('Could not sign in! Try again');
        });
    }
    async function register() {
        if (authInProgress || registerInProgress)
            return;
        const email = getI('#form-email').value.trim();
        const password = getI('#form-password').value;
        const nickname = getI('#form-nickname').value.trim();
        if (!email) {
            return alert('Email cannot be empty');
        }
        if (!utils_1.validEmail(email)) {
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
        buttonText.innerText = 'Registering...';
        registerInProgress = true;
        const data = { email, password, nickname };
        const url = 'https://raino-backend.glitch.me/register/';
        const json = await utils_1.request('POST', url, data);
        const res = utils_1.parseJson(json);
        registerInProgress = false;
        buttonText.innerText = 'Continue';
        if (res === null) {
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
        if (authInProgress || registerInProgress)
            return;
        const email = getI('#form-email').value.trim();
        const password = getI('#form-password').value;
        if (!email) {
            return alert('Email cannot be empty');
        }
        if (!password) {
            return alert('Password cannot be empty');
        }
        if (!utils_1.validEmail(email)) {
            return alert('Invalid email address');
        }
        if (password.length < 3 || password.length > 100) {
            return alert('Password too long or short');
        }
        hideInputs();
        buttonText.innerText = 'Signing in...';
        const data = { email, password };
        const url = 'https://raino-backend.glitch.me/login/';
        const json = await utils_1.request('POST', url, data);
        const res = utils_1.parseJson(json);
        if (res === null) {
            buttonText.innerText = 'Continue';
            showInputs();
            return alert('Server error!');
        }
        if (!res.success) {
            buttonText.innerText = 'Continue';
            showInputs();
            // TODO: convert msg to something more friendly
            return alert(res.msg);
        }
        buttonText.innerText = 'Authorizing...';
        localStorage.token = res.token;
        localStorage.tokenSelector = res.selector;
        global_1.Global.token = res.token;
        global_1.Global.tokenSelector = res.selector;
        if (global_1.Global.socket && global_1.Global.socket.connected) {
            return utils_1.authSocket();
        }
        if (global_1.Global.socket) {
            global_1.Global.socket.disconnect();
        }
        initSocketAuth();
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
    utils_1.getAll('#form-email, #form-password').forEach(input => {
        input.addEventListener('keyup', e => {
            if (e.code !== 'Enter')
                return;
            login();
        });
    });
    utils_1.get('#logout').addEventListener('click', async (e) => {
        global_1.Global.token = null;
        global_1.Global.tokenSelector = null;
        localStorage.removeItem('token');
        localStorage.removeItem('tokenSelector');
        // await request('POST', 'https://raino-backend.glitch.me/logout/');
        window.location.reload();
    });
    button.addEventListener('mouseenter', function (e) {
        if (registerInProgress || authInProgress)
            return;
        oldButtonText = buttonText.innerText;
        buttonText.innerText = 'To infinity and beyond!';
    });
    button.addEventListener('mouseleave', function (e) {
        if (registerInProgress || authInProgress)
            return;
        buttonText.innerText = oldButtonText;
    });
})();

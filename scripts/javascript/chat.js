"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatEvents = void 0;
const global_1 = require("./global");
const utils_1 = require("./utils");
const messages = [];
function registerChatEvents() {
    const socket = global_1.Global.socket;
    socket.on('message', (data) => {
        const prevMessage = messages[messages.length - 1];
        const sameUser = prevMessage && prevMessage.from === data.from;
        const wrapper = utils_1.get('.messages-wrapper');
        const msgWrap = utils_1.create('div', { class: 'content' }, data.message);
        if (!sameUser) {
            // append a new tile
            const tile = utils_1.create('div', { class: 'tile' });
            const avatarWrap = utils_1.create('div', { class: 'avatar-wrap' });
            avatarWrap.appendChild(utils_1.create('img', { src: 'https://cdn.discordapp.com/emojis/804006374421299261.png?v=1' }));
            tile.appendChild(avatarWrap);
            const right = utils_1.create('div', { class: 'right' });
            const top = utils_1.create('div', { class: 'top' });
            top.appendChild(utils_1.create('div', { class: 'nick' }, data.from));
            top.appendChild(utils_1.create('div', { class: 'time' }, 'Today'));
            right.appendChild(top);
            const messagesWrap = utils_1.create('div', { class: 'content-wrapper' });
            messagesWrap.appendChild(msgWrap);
            right.appendChild(messagesWrap);
            tile.appendChild(right);
            wrapper.appendChild(tile);
        }
        else {
            const lastTile = utils_1.get('.messages-wrapper .tile:last-child .content-wrapper');
            lastTile.appendChild(msgWrap);
        }
        messages.push(data);
    });
}
exports.registerChatEvents = registerChatEvents;
(async () => {
    utils_1.get('.message-input').addEventListener('keydown', function (e) {
        if (e.code !== 'Enter')
            return;
        const self = this;
        const message = self.value.trim();
        self.value = '';
        if (!message)
            return;
        global_1.Global.socket.emit('message', message);
    });
})();

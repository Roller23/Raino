"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatEvents = void 0;
const global_1 = require("./global");
const utils_1 = require("./utils");
const messages = [];
const shouldScroll = (el) => {
    return (el.scrollHeight - el.offsetHeight) - el.scrollTop < 10;
};
function registerChatEvents() {
    const socket = global_1.Global.socket;
    socket.on('message', (data) => {
        const prevMessage = messages[messages.length - 1];
        const sameUser = prevMessage && prevMessage.from === data.from;
        const wrapper = utils_1.get('.messages-wrapper');
        const msgWrap = utils_1.create('div', { class: 'content' }, data.message);
        const messagesContainer = utils_1.get('.messages-wrapper');
        const scroll = shouldScroll(messagesContainer);
        if (!sameUser) {
            // append a new tile
            const tile = utils_1.create('div', { class: 'tile' });
            const avatarWrap = utils_1.create('div', { class: 'avatar-wrap' });
            avatarWrap.appendChild(utils_1.create('img', { src: 'https://cdn.discordapp.com/avatars/310875718651346945/1c9539f3583ff0770c37a31382d9f5c1.png' }));
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
        if (scroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight * 2;
        }
        messages.push(data);
    });
}
exports.registerChatEvents = registerChatEvents;
(async () => {
    utils_1.get('.message-input').addEventListener('keydown', function (e) {
        if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const self = this;
            const message = self.value.trim();
            self.value = '';
            if (!message)
                return;
            global_1.Global.socket.emit('message', message);
        }
    });
})();

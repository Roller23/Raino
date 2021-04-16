"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatEvents = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const global_1 = require("./global");
const utils_1 = require("./utils");
;
;
;
const roomsData = {
    GENERAL_CHANNEL: {
        messages: []
    }
};
/**
 * @param date a Date object or a number (timestamp)
 * @param timezone a string representation of source timezone
 * @returns string representation of the date (from now)
 */
const formatDate = (date, timezone) => {
    date = new Date(date);
    const serverTime = moment_timezone_1.default.tz(date, timezone);
    return moment_timezone_1.default.tz(serverTime, global_1.Global.timezone).calendar(null, {
        lastDay: '[Yesterday at] HH:mm',
        sameDay: '[Today at] HH:mm',
        nextDay: '[Tomorrow at] HH:mm',
        lastWeek: '[last] dddd [at] HH:mm',
        nextWeek: 'Next dddd [at] HH:mm',
        sameElse: 'L'
    });
};
/**
 * @param el element to be tested
 * @returns a boolean indicating whether the element should be scrolled to bottom
 */
const shouldScroll = (el) => {
    return (el.scrollHeight - el.offsetHeight) - el.scrollTop < 10;
};
/**
 * @param data Message data
 * @returns HTMLElement with the message
 */
const createMessage = (data) => {
    return utils_1.create('div', { class: 'content' }, data.message);
};
/**
 * @param wrapper element to be scrolled down
 */
const scrollDownMessagesContainer = (wrapper) => {
    wrapper.scrollTop = wrapper.scrollHeight * 2;
};
/**
 * @param data ServerMessage object used to populate the returned element's content
 * @returns HTMLElement object containing the Message data
 */
const createMessageTile = (data) => {
    const tile = utils_1.create('div', { class: 'tile' });
    const avatarWrap = utils_1.create('div', { class: 'avatar-wrap' });
    avatarWrap.appendChild(utils_1.create('img', { src: 'https://cdn.discordapp.com/avatars/310875718651346945/1c9539f3583ff0770c37a31382d9f5c1.png' }));
    tile.appendChild(avatarWrap);
    const right = utils_1.create('div', { class: 'right' });
    const top = utils_1.create('div', { class: 'top' });
    top.appendChild(utils_1.create('div', { class: 'nick' }, data.from));
    top.appendChild(utils_1.create('div', { class: 'time' }, formatDate(data.date, data.timezone)));
    right.appendChild(top);
    const messagesWrap = utils_1.create('div', { class: 'content-wrapper' });
    right.appendChild(messagesWrap);
    tile.appendChild(right);
    return tile;
};
const renderMessage = (channel, message) => {
    if (!roomsData[channel]) {
        console.error('Channel', channel, 'does not exist');
        return;
    }
    const roomData = roomsData[channel];
    const prevMessage = roomData.messages[roomData.messages.length - 1];
    const sameUser = prevMessage && prevMessage.from === message.from;
    const over5MinutesPassed = prevMessage && (() => {
        const msgDate = new Date(message.date);
        const prevMsgDate = new Date(prevMessage.date);
        const minute = 60;
        const maxLimit = minute * 3;
        return ((msgDate.getTime() - prevMsgDate.getTime()) / 1000) > maxLimit;
    })();
    const shouldAddNewTile = !sameUser || over5MinutesPassed;
    const messagesContainer = utils_1.get('.messages-wrapper');
    const scrollContainer = shouldScroll(messagesContainer);
    if (shouldAddNewTile) {
        // append a new tile
        messagesContainer.appendChild(createMessageTile(message));
    }
    const lastTileContent = utils_1.get('.messages-wrapper .tile:last-child .content-wrapper');
    lastTileContent.appendChild(createMessage(message));
    if (scrollContainer) {
        scrollDownMessagesContainer(messagesContainer);
    }
};
utils_1.get('.message-input').addEventListener('keydown', function (e) {
    if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const self = this;
        const message = self.value.trim();
        if (!message)
            return;
        self.value = '';
        global_1.Global.socket.emit('message', { message, channel: 'GENERAL_CHANNEL' });
    }
});
/**
 *
 * Registers all chat related socket events on the global socket object.
 * Should only be called after successfully authenticating the socket
 *
 * @returns void
 */
function registerChatEvents() {
    if (global_1.Global.socket === null) {
        console.error('Global.socket is null! registerChatEvents() should only be called after authenticating the socket');
        return;
    }
    const socket = global_1.Global.socket;
    if (socket.hasListeners('message')) {
        // socket already has these listeners so return
        // to prevent adding them again
        return;
    }
    socket.on('message', (data) => {
        console.log('message', data);
        if (!roomsData[data.channel]) {
            console.error('Channel', data.channel, 'does not exist');
            return;
        }
        renderMessage('GENERAL_CHANNEL', data);
        roomsData[data.channel].messages.push(data);
    });
    socket.on('channel messages', (data) => {
        if (!roomsData[data.channel]) {
            console.error('Channel', data.channel, 'does not exist');
            return;
        }
        data.messages.forEach((message) => {
            renderMessage(data.channel, message);
            roomsData[data.channel].messages.push(message);
        });
    });
}
exports.registerChatEvents = registerChatEvents;

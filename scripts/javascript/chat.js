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
const formatHour = (date, timezone) => {
    date = new Date(date);
    const serverTime = moment_timezone_1.default.tz(date, timezone);
    return moment_timezone_1.default.tz(serverTime, global_1.Global.timezone).format('HH:mm');
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
    const wrapper = utils_1.create('div', { class: 'content-container' });
    const date = utils_1.create('div', { class: 'date' }, formatHour(data.date, data.timezone));
    const content = utils_1.create('div', { class: 'content' }, data.message);
    content.appendChild(date);
    wrapper.appendChild(content);
    return wrapper;
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
    avatarWrap.appendChild(utils_1.create('img', { src: 'images/user-placeholder.png' }));
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
const showLeftPanel = () => {
    utils_1.get('.hidden-left-panel').classList.add('visible');
    utils_1.get('.middle-panel').classList.add('moved');
};
const toggleLeftPanel = () => {
    utils_1.get('.hidden-left-panel').classList.toggle('visible');
    utils_1.get('.middle-panel').classList.toggle('moved');
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
utils_1.get('.current-server').addEventListener('click', e => {
    toggleLeftPanel();
    localStorage.hiddenLeftPanelVisible = utils_1.get('.hidden-left-panel').classList.contains('visible');
});
// TODO: export default localStorage values to another file
if (!localStorage.hiddenLeftPanelVisible) {
    localStorage.hiddenLeftPanelVisible = 'true';
}
if (localStorage.hiddenLeftPanelVisible === 'true') {
    showLeftPanel();
}
/**
 * Registers all chat related socket events on the global socket object.
 * Should only be called after successfully authenticating the socket
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
        renderMessage(data.channel, data);
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

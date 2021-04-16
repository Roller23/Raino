import moment from 'moment-timezone';
import { Global } from "./global";
import { create, get } from "./utils";

interface ServerMessage {
  message: string;
  from: string;
  userID: string;
  date: string;
  timezone: string;
};

interface RoomData {
  [key: string]: {
    messages: ServerMessage[]
  }
};

const roomsData: RoomData = {
  GLOBAL: {
    messages: []
  }
};

/**
 * @param date a Date object or a number (timestamp)
 * @param timezone a string representation of source timezone
 * @returns string representation of the date (from now)
 */

const formatDate = (date: Date | string | number, timezone: string): string => {
  date = new Date(date);
  const serverTime = moment.tz(date, timezone)
  return moment.tz(serverTime, Global.timezone).calendar(null, {
    lastDay: '[Yesterday at] HH:mm',
    sameDay: '[Today at] HH:mm',
    nextDay: '[Tomorrow at] HH:mm',
    lastWeek: '[last] dddd [at] HH:mm',
    nextWeek: 'Next dddd [at] HH:mm',
    sameElse: 'L'
  });
}

/**
 * @param el element to be tested
 * @returns a boolean indicating whether the element should be scrolled to bottom
 */

const shouldScroll = (el: HTMLElement): boolean => {
  return (el.scrollHeight - el.offsetHeight) - el.scrollTop < 10;
}

/**
 * @param data Message data
 * @returns HTMLElement with the message
 */

const createMessage = (data: ServerMessage): HTMLElement => {
  return create('div', {class: 'content'}, data.message);
}

/**
 * @param wrapper element to be scrolled down
 */

const scrollDownMessagesContainer = (wrapper: HTMLElement): void => {
  wrapper.scrollTop = wrapper.scrollHeight * 2;
}

/**
 * @param data ServerMessage object used to populate the returned element's content
 * @returns HTMLElement object containing the Message data
 */

const createMessageTile = (data: ServerMessage): HTMLElement => {
  const tile = create('div', {class: 'tile'});
  const avatarWrap = create('div', {class: 'avatar-wrap'});
  avatarWrap.appendChild(create('img', {src: 'https://cdn.discordapp.com/avatars/310875718651346945/1c9539f3583ff0770c37a31382d9f5c1.png'}));
  tile.appendChild(avatarWrap);
  const right = create('div', {class: 'right'});
  const top = create('div', {class: 'top'});
  top.appendChild(create('div', {class: 'nick'}, data.from));
  top.appendChild(create('div', {class: 'time'}, formatDate(data.date, data.timezone)));
  right.appendChild(top);
  const messagesWrap = create('div', {class: 'content-wrapper'});
  right.appendChild(messagesWrap);
  tile.appendChild(right);
  return tile;
}

get('.message-input')!.addEventListener('keydown', function(this: HTMLElement, e: KeyboardEvent): void {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const self = <HTMLInputElement>this;
    const message = self.value.trim();
    self.value = '';
    if (!message) return;
    Global.socket!.emit('message', message);
  }
});

/**
 * 
 * Registers all chat related socket events on the global socket object.
 * Should only be called after successfully authenticating the socket
 * 
 * @returns void
 */

export function registerChatEvents(): void {
  if (Global.socket === null) {
    console.error('Global.socket is null! registerChatEvents() should only be called after authenticating the socket');
    return;
  }
  const socket = Global.socket;
  if (socket.hasListeners('message')) {
    // socket already has these listeners so return
    // to prevent adding them again
    return;
  }
  socket.on('message', (data: ServerMessage) => {
    console.log('message', data);
    const prevMessage = roomsData.GLOBAL.messages[roomsData.GLOBAL.messages.length - 1];
    const sameUser = prevMessage && prevMessage.from === data.from;
    const minute = 60;
    const over5MinutesPassed = prevMessage && ((Date.now() - Number(new Date(prevMessage.date))) / 1000) > (minute * 3);
    const shouldAddNewTile = !sameUser || over5MinutesPassed;
    const wrapper = get('.messages-wrapper')!;
    const messagesContainer = get('.messages-wrapper')!;
    const scrollContainer = shouldScroll(messagesContainer);
    if (shouldAddNewTile) {
      // append a new tile
      wrapper.appendChild(createMessageTile(data))
    }
    const lastTileContent = get('.messages-wrapper .tile:last-child .content-wrapper')!;
    lastTileContent.appendChild(createMessage(data));
    if (scrollContainer) {
      scrollDownMessagesContainer(messagesContainer);
    }
    roomsData.GLOBAL.messages.push(data);
  });
}
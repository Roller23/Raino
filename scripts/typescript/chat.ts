import moment from 'moment-timezone';
import { Global } from "./global";
import { create, get } from "./utils";

interface ServerMessage {
  dbID?: string;
  channel: string;
  server: string;
  message: string;
  from: string;
  userID: string;
  date: string;
  timezone: string;
};

interface ChannelMessages {
  channel: string;
  messages: ServerMessage[];
};

interface RoomData {
  [key: string]: {
    messages: ServerMessage[]
  }
};

type DateInput = Date | string | number;

const roomsData: RoomData = {
  GENERAL_CHANNEL: {
    messages: []
  }
};

/**
 * @param date a Date object or a number (timestamp)
 * @param timezone a string representation of source timezone
 * @returns string representation of the date (from now)
 */

const formatDate = (date: DateInput, timezone: string): string => {
  date = new Date(date);
  const serverTime = moment.tz(date, timezone);
  return moment.tz(serverTime, Global.timezone).calendar(null, {
    lastDay: '[Yesterday at] HH:mm',
    sameDay: '[Today at] HH:mm',
    nextDay: '[Tomorrow at] HH:mm',
    lastWeek: '[last] dddd [at] HH:mm',
    nextWeek: 'Next dddd [at] HH:mm',
    sameElse: 'L'
  });
}

const formatHour = (date: DateInput, timezone: string): string => {
  date = new Date(date);
  const serverTime = moment.tz(date, timezone)
  return moment.tz(serverTime, Global.timezone).format('HH:mm');
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
  const wrapper = create('div', {class: 'content-container'});
  const date = create('div', {class: 'date'}, formatHour(data.date, data.timezone));
  const content = create('div', {class: 'content'}, data.message);
  content.appendChild(date);
  wrapper.appendChild(content);
  return wrapper;
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
  avatarWrap.appendChild(create('img', {src: 'images/user-placeholder.png'}));
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

const renderMessage = (channel: string, message: ServerMessage): void => {
  if (!roomsData[channel]) {
    console.error('Channel', channel, 'does not exist');
    return;
  }
  const roomData = roomsData[channel];
  const prevMessage = roomData.messages[roomData.messages.length - 1];
  const sameUser = prevMessage && prevMessage.from === message.from;
  const over5MinutesPassed = prevMessage && ((): boolean => {
    const msgDate = new Date(message.date);
    const prevMsgDate = new Date(prevMessage.date);
    const minute = 60;
    const maxLimit = minute * 3;
    return ((msgDate.getTime() - prevMsgDate.getTime()) / 1000) > maxLimit;
  })();
  const shouldAddNewTile = !sameUser || over5MinutesPassed;
  const messagesContainer = get('.messages-wrapper')!;
  const scrollContainer = shouldScroll(messagesContainer);
  if (shouldAddNewTile) {
    // append a new tile
    messagesContainer.appendChild(createMessageTile(message))
  }
  const lastTileContent = get('.messages-wrapper .tile:last-child .content-wrapper')!;
  lastTileContent.appendChild(createMessage(message));
  if (scrollContainer) {
    scrollDownMessagesContainer(messagesContainer);
  }
}

const showLeftPanel = (): void => {
  get('.hidden-left-panel')!.classList.add('visible');
  get('.middle-panel')!.classList.add('moved');
};

const toggleLeftPanel = (): void => {
  get('.hidden-left-panel')!.classList.toggle('visible');
  get('.middle-panel')!.classList.toggle('moved');
};

get('.message-input')!.addEventListener('keydown', function(this: HTMLElement, e: KeyboardEvent): void {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const self = <HTMLInputElement>this;
    const message: string = self.value.trim();
    if (!message) return;
    self.value = '';
    Global.socket!.emit('message', {message, channel: 'GENERAL_CHANNEL'});
  }
});

get('.current-server')!.addEventListener('click', e => {
  toggleLeftPanel();
  localStorage.hiddenLeftPanelVisible = get('.hidden-left-panel')!.classList.contains('visible');
});

// TODO: export default localStorage values to another file

if (!localStorage.hiddenLeftPanelVisible) {
  localStorage.hiddenLeftPanelVisible = 'true';
}

if (localStorage.hiddenLeftPanelVisible === 'true') {
  showLeftPanel();
}

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
    if (!roomsData[data.channel]) {
      console.error('Channel', data.channel, 'does not exist');
      return;
    }
    renderMessage('GENERAL_CHANNEL', data);
    roomsData[data.channel].messages.push(data);
  });

  socket.on('channel messages', (data: ChannelMessages) => {
    if (!roomsData[data.channel]) {
      console.error('Channel', data.channel, 'does not exist');
      return;
    }
    data.messages.forEach((message: ServerMessage) => {
      renderMessage(data.channel, message);
      roomsData[data.channel].messages.push(message);
    });
  });
}
import { Global } from "./global";
import { create, get } from "./utils";

interface Message {
  message: string;
  from: string;
}

const messages: Message[] = [];

const shouldScroll = (el: HTMLElement): boolean => {
  return (el.scrollHeight - el.offsetHeight) - el.scrollTop < 10;
}

export function registerChatEvents(): void {
  const socket = Global.socket!;
  if (socket.hasListeners('message')) {
    // socket already has these listeners so return
    // to prevent adding them again
    return;
  }
  socket.on('message', (data: Message) => {
    const prevMessage = messages[messages.length - 1];
    const sameUser = prevMessage && prevMessage.from === data.from;
    const wrapper = get('.messages-wrapper')!;
    const msgWrap = create('div', {class: 'content'}, data.message);
    const messagesContainer = get('.messages-wrapper')!;
    const scroll = shouldScroll(messagesContainer);
    if (!sameUser) {
      // append a new tile
      const tile = create('div', {class: 'tile'});
      const avatarWrap = create('div', {class: 'avatar-wrap'});
      avatarWrap.appendChild(create('img', {src: 'https://cdn.discordapp.com/avatars/310875718651346945/1c9539f3583ff0770c37a31382d9f5c1.png'}));
      tile.appendChild(avatarWrap);
      const right = create('div', {class: 'right'});
      const top = create('div', {class: 'top'});
      top.appendChild(create('div', {class: 'nick'}, data.from));
      top.appendChild(create('div', {class: 'time'}, 'Today'));
      right.appendChild(top);
      const messagesWrap = create('div', {class: 'content-wrapper'});
      messagesWrap.appendChild(msgWrap);
      right.appendChild(messagesWrap);
      tile.appendChild(right);
      wrapper.appendChild(tile)
    } else {
      const lastTile = get('.messages-wrapper .tile:last-child .content-wrapper')!;
      lastTile.appendChild(msgWrap);
    }
    if (scroll) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight * 2;
    }
    messages.push(data);
  });
}

(async () => {
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
})();
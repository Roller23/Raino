import { Global } from "./global";
import { create, get } from "./utils";

interface Message {
  message: string;
  from: string;
}

const messages: Message[] = [];

export function registerChatEvents(): void {
  const socket = Global.socket!;
  socket.on('message', (data: Message) => {
    const prevMessage = messages[messages.length - 1];
    const sameUser = prevMessage && prevMessage.from === data.from;
    const wrapper = get('.messages-wrapper')!;
    const msgWrap = create('div', {class: 'content'}, data.message);
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
    get('.messages-wrapper')!.scrollTop = get('.messages-wrapper')!.scrollHeight * 2;
    messages.push(data);
  });
}

(async () => {
  get('.message-input')!.addEventListener('keydown', function(this: HTMLElement, e: KeyboardEvent): void {
    if (e.code !== 'Enter') return;
    const self = <HTMLInputElement>this;
    const message = self.value.trim();
    self.value = '';
    if (!message) return;
    Global.socket!.emit('message', message);
  });
})();
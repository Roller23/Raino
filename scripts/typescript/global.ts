import { Socket } from "socket.io-client";

export namespace Global {
  export let test: string = 'Hello World!';
  export let token: string | null = null;
  export let socket: Socket | null = null;
}
import { Socket } from "socket.io-client";

export namespace Global {
  export let token: string | null = null;
  export let socket: Socket | null = null;
}
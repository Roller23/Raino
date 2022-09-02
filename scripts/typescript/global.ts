/**
 * Global variables to be shared across modules
 */

import { Socket } from "socket.io-client";
import moment from 'moment-timezone';

export namespace Global {
  export let token: string | null = null;
  export let tokenSelector: string | null = null;
  export let socket: Socket | null = null;
  export const timezone: string = moment.tz.guess();
}
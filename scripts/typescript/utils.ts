/**
 * Global utility functions
 */

import { Global } from "./global";

export function get(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export async function request(method: string, url: string, data: Object): Promise<string> {
  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: method,
    body: JSON.stringify(data)
  };
  return (await fetch(url, options)).text();
}

export function parseJson(json: string): any {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log('Could not parse json:', json);
    return null;
  }
}

export function validEmail(value: string): boolean {
  const input = document.createElement('input');
  input.type = 'email';
  input.required = true;
  input.value = value;
  return input.checkValidity();
}

export function authSocket(): void {
  if (!Global.token || !Global.socket) return;
  Global.socket.emit('authenticate', Global.token);
}
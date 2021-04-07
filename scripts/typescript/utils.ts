/**
 * Global utility functions
 */

import { Global } from "./global";

export function get(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export function getAll(selector: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(selector);
}

export async function request(method: string, url: string, data: Object = {}): Promise<string> {
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
  console.log(Global.tokenSelector)
  Global.socket.emit('authenticate', {
    selector: Global.tokenSelector,
    token: Global.token
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fadeOut(el: HTMLElement, ms: number): Promise<void> {
  return new Promise(resolve => {
    const oldTransition = el.style.transition;
    const callback = (): void => {
      el.style.transition = oldTransition;
      el.style.display = 'none';
      el.removeEventListener('transitionend', callback);
      resolve();
    }
    el.addEventListener('transitionend', callback);
    el.style.opacity = '1';
    el.style.transition = `opacity ${ms}ms`;
    el.style.opacity = '0';
  });
}

type AttrsObject = {
  [key: string]: string
};

export function create(tag: string, attrs: AttrsObject = {}, text: string = ''): HTMLElement {
  const res = document.createElement(tag);
  Object.keys(attrs).forEach(key => {
    res.setAttribute(key, attrs[key]);
  });
  if (text) {
    res.innerText = text;
  }
  return res;
}
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

export function on(el: string | HTMLElement, e: string, callback: EventListenerOrEventListenerObject): HTMLElement {
  const element = typeof el === 'string' ? get(el)! : el;
  element.addEventListener(e, callback);
  return element;
}

export function onAll(el: string | NodeListOf<HTMLElement>, e: string, callback: EventListenerOrEventListenerObject): NodeListOf<HTMLElement> {
  const elements = typeof el === 'string' ? getAll(el) : el;
  elements.forEach(element => on(element, e, callback));
  return elements;
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

export type ElementOffset = {
  left: number;
  top: number
};

/**
 * Returns an element's position relative to the whole document (page).
 *
 * @example getOffset(document.getElementById('#element'));
 *
 * @param el
 * @see https://stackoverflow.com/a/28222246/2391795
 */
export const getElementOffset = (el: HTMLElement): ElementOffset => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX + el.offsetWidth,
    top: rect.top + window.scrollY + Math.floor(el.offsetHeight / 2),
  };
};
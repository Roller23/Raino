/**
 * Global utility functions
 * Mainly for DOM stuff
 */

const get = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
}

interface HTMLElement {
  on(event: string, callback: EventListenerOrEventListenerObject): HTMLElement;
}

HTMLElement.prototype.on = function(this: HTMLElement, event: string, callback: EventListenerOrEventListenerObject): HTMLElement {
  this.addEventListener(event, callback);
  return this;
}

const request = async (method: string, url: string, data: Object): Promise<string> => {
  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: method,
    body: JSON.stringify(data)
  };
  return (await fetch(url, options)).text();
}

const parseJson = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log('Could not parse json:', json);
    return null;
  }
}

const validEmail = (value: string): boolean => {
  const input = document.createElement('input');
  input.type = 'email';
  input.required = true;
  input.value = value;
  return input.checkValidity();
}
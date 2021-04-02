/**
 * Global utility functions
 * Mainly for DOM stuff
 */

const get = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
}

interface HTMLElement {
  on(event: string, callback: any): HTMLElement;
}

HTMLElement.prototype.on = function(this: HTMLElement, event: string, callback: any): HTMLElement {
  this.addEventListener(event, callback);
  return this;
}
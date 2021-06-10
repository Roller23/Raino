import { create, getAll, getElementOffset } from "./utils";

export interface TooltipPosition {
  top: number
  left: number
}

export function createTooltip(text: string, pos: TooltipPosition): void {
  const tooltip = create('div', {class: 'tooltip'}, text);
  tooltip.style.top = `${pos.top}px`;
  tooltip.style.left = `${pos.left + 10}px`;
  document.body.append(tooltip);
  setTimeout(() => tooltip.classList.add('visible'), 20)
}

export function removeTooltips(): void {
  // for now this function assumes that only one tooltip can exists at a time
  // in case that changes this function needs to be rewritten
  getAll('.tooltip').forEach(tooltip => {
    tooltip.classList.remove('visible');
    tooltip.addEventListener('transitionend', e => tooltip.remove());
  });
}

export function addToolTip(element: HTMLElement, text: string) {
  // for dynamically created tooltips
  element.addEventListener('mouseenter', function(e) {
    createTooltip(text, getElementOffset(this));
  });
  element.addEventListener('mouseleave', removeTooltips);
}

(() => {
  getAll('[tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const tipStr = this.getAttribute('tooltip');
      if (!tipStr) return;
      const pos = getElementOffset(this);
      createTooltip(tipStr, pos);
    });
    element.addEventListener('mouseleave', removeTooltips);
  });
})();
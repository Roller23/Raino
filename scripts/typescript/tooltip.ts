import { create, getAll, getElementOffset } from "./utils";

export interface TooltipPosition {
  top: number
  left: number
}

/**
 * Creates a tooltip and appends it to <body>
 * @param text tooltip's text
 * @param pos tooltip's fixed position
 */

export function createTooltip(text: string, pos: TooltipPosition): void {
  const tooltip = create('div', {class: 'tooltip'}, text);
  tooltip.style.top = `${pos.top}px`;
  tooltip.style.left = `${pos.left + 10}px`;
  document.body.append(tooltip);
  setTimeout(() => tooltip.classList.add('visible'), 20)
}

/**
 * For now this function assumes that only one tooltip can exists at a time
 * in case that changes this function needs to be rewritten
 */

export function removeTooltips(): void {
  getAll('.tooltip').forEach(tooltip => {
    tooltip.classList.remove('visible');
    tooltip.addEventListener('transitionend', e => tooltip.remove());
  });
}

/**
 * Used to create tooltips for dynamic elements
 * @param element element to the tooltip's position will be relative to
 * @param text tooltip text
 */

export function addToolTip(element: HTMLElement, text: string) {
  element.addEventListener('mouseenter', function(e) {
    createTooltip(text, getElementOffset(this));
  });
  element.addEventListener('mouseleave', removeTooltips);
}

(() => {
  // Add listeners for static tooltips
  getAll('[tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const tipStr = this.getAttribute('tooltip');
      if (!tipStr) return;
      createTooltip(tipStr, getElementOffset(this));
    });
    element.addEventListener('mouseleave', removeTooltips);
  });
})();
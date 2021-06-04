import { Global } from "./global";
import { create, get, getAll, getElementOffset } from "./utils";

(async () => {
  getAll('[tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const tipStr = this.getAttribute('tooltip');
      if (!tipStr) return;
      const pos = getElementOffset(this);
      const tooltip = create('div', {class: 'tooltip'}, tipStr);
      tooltip.style.top = `${pos.top}px`;
      tooltip.style.left = `${pos.left + 10}px`;
      document.body.append(tooltip);
      setTimeout(() => tooltip.classList.add('visible'), 20)
    });
    element.addEventListener('mouseleave', function(e) {
      // for now this function assumes that only one tooltip can exists at a time
      // in case that changes this function needs to be rewritten
      getAll('.tooltip').forEach(tooltip => {
        tooltip.classList.remove('visible');
        tooltip.addEventListener('transitionend', e => tooltip.remove());
      });
    });
  });
})();
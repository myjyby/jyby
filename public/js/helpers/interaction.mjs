import { d3 } from './index.mjs';

export const setScrollAnimations = function (nodes) {
  const observer = new IntersectionObserver(els => {
    els.forEach((el, i) => {
      if (el.isIntersecting) {
        setTimeout(_ => {
          d3.select(el.target).classed('animate-in', true)
          .on('animationend', function () {
            d3.select(this)
              .classed('invisible', false);
          });
        }, i * 250);
      }
    });
  });

  for (const node of nodes) {
    node.classList.add('invisible');
    observer.observe(node);
  }
}
import { CountUp } from '/src/assets/js/lib/countup.js';

const statElements = document.querySelectorAll('[data-stat]');

class StatBox {
  constructor(el, {
    duration = 1500,
		delay = 1000
  } = {}) {
    const number = el.querySelector('.callout-stat-number');
    const finish = parseInt(el.dataset.stat);
    const suffix = el.dataset.statSuffix || '';
		const prefix = el.dataset.statPrefix || '';
    const options = {
      duration: duration / 1000,
			suffix,
			prefix
		};
		this.countup = new CountUp(number, finish, options);
    
    if (!this.countup.error) {
      setTimeout(() => this.countup.start(), delay);
    } else {
      console.error(this.countup.error);
    }
  }
}

// statElements.forEach(el => new StatBox(el, { delay: 1200 }));

// Animate when element is in view, if not inside a swiper
statElements.forEach(function (el) {
	if (el.closest('.swiper-slide') == null) { 
		window.addEventListener('scroll', checkPosition);
		const windowHeight = window.innerHeight;
		function checkPosition() {
			const positionFromTop = el.getBoundingClientRect().top;
			if (positionFromTop - windowHeight <= 0) {
				if (!el.classList.contains('animate')) new StatBox(el, { delay: 0 });
				el.classList.add('animate');
			}
			else {
				el.classList.remove('animate');
			}
		}
	}
});

/**
 * Animate elements when scrolled into view
 */

const animateElements = document.querySelectorAll('.animate-in-view');

/* // Animate when element is in view
animateElements.forEach(function (el) {
	window.addEventListener('scroll', checkPosition);
	const windowHeight = window.innerHeight;
	function checkPosition() {
		const positionFromTop = el.getBoundingClientRect().top;
		if (positionFromTop - windowHeight <= 0) {
			el.classList.add('animate');
		}
		else {
			el.classList.remove('animate');
		}
	}
}); */

class AnimateInView {
	constructor(el) {
		const $this = this;
		const windowHeight = window.innerHeight;
		
		window.addEventListener('scroll', function () {
			const positionFromTop = $this.checkPosition(el, windowHeight);
			if (positionFromTop - windowHeight <= 0) {
				// Element is a callout stat with number
				if (el.hasAttribute("data-stat") && !el.classList.contains('animate')) new StatBox(el, { delay: 0 });
				// Add .animate class
				el.classList.add('animate');
			}
			else {
				el.classList.remove('animate');
			}
		});
	}

	checkPosition(el) {
		return el.getBoundingClientRect().top;
	}
} 

animateElements.forEach(el => new AnimateInView(el));
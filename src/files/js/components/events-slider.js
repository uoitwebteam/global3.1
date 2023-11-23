/**
 * Events feed module
 */
import Swiper from 'swiper';

const eventsModule = document.querySelectorAll('#events-slider');

eventsModule.forEach(element => {
	new Swiper(element, {
		// Accessibility
		a11y: true,
		keyboardControl: true,
		mousewheelControl: true,
		// Layout 
		spaceBetween: 30, 
		// slidesPerView: 2,
		freeMode: true,
		setWrapperSize: true,
		breakpoints: {
			1000: {
				slidesPerView: 1
			}, 
			2000: {
				slidesPerView: 2
			}
		},
		// Transition
		direction: 'horizontal',
		speed: 600, 
		// Loop
		loop: false,
		// Navigation
		touchEventsTarget: 'wrapper',
		grabCursor: true,
		// nextButton: '.swiper-button-next',
		// prevButton: 'swiper-button-prev',
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: false,
		scrollbarDraggable: true,
		// Events
		onInit: function(swiper) {
			console.log('events Swiper.onInit');
			// console.log(element);
		}
	});
});

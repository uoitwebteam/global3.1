console.log('Load: [media/videos.js]');
/**
 * Videos
 * 
 * 1.	Responsive videos/media
 * 2.	Video gallery row - Swiper slider
 */

import $ from 'jquery';

// 1. Responsive videos/media
// --------------------------

if ($('iframe[src*="youtube.com"]').length || $('iframe[src*="vimeo.com"]').length) {
	console.log('[videos] responsive embed');
	// Foundation 6 Responsive Embed
	// exclude elements with class "non-responsive-embed" or attribute "data-responsive-embed=false"
	$('iframe[src*="youtube.com"]:not(".non-responsive-embed"):not(".not_responsive_video"):not([data-responsive-embed="false"])').wrap('<div class="responsive-embed widescreen"/>');  
	$('iframe[src*="vimeo.com"]:not(".non-responsive-embed"):not(".not_responsive_video")').wrap('<div class="responsive-embed widescreen"/>');
}

// 2. Video gallery row - Swiper slider
// ------------------------------------

if ($('.gallery_row_video.swiper-container').length) {
	const galleryRow = new Swiper ('.gallery_row_video', {
		direction: 'horizontal',
		loop: true,
		speed: 600, 
		grabCursor: true,
		centeredSlides: false,
		spaceBetween: 5,
		slidesPerView: 'auto',
		pagination: '.swiper-pagination',
		paginationClickable: true,
		// nextButton: '#swiper-video-next',
		// prevButton: '#swiper-video-prev',
		preloadImages: false,
		lazyLoading: true,
		onInit: function(slide) {
			console.log('[videos] gallery_row_video swiper init');
		}
	});
}

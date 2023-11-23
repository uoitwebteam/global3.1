// import * as Masonry from 'masonry-layout';
import $ from 'jquery';
import justifiedGallery from 'justifiedGallery';
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

export const photoGalleries = document.querySelectorAll('.gallery-grid, .gallery_grid');
export const inlineGalleries = document.querySelectorAll('.gallery-inline, .gallery_row, .gallery-row');

export class photoGallery {	
	constructor() {
		photoGalleries.forEach(function (el) {
			// console.log('Photo gallery:');
			// console.log(el);

			// Set row height
			let height = el.dataset.height ? el.dataset.height : 180;
			// console.log(el.dataset.height);

			// Set margin size
			let margin = el.dataset.margin ? el.dataset.margin : 5;
	
			// const gallery = new Masonry(el, {
			// 	// initLayout: false,
			// 	itemSelector: '.grid-item',
			// 	columnWidth: '.grid-sizer',
			// 	gutter: 6
			// });
	
			// Remove legacy .grid-sizer element
			if (el.querySelector('.grid-sizer')) {
				el.querySelector('.grid-sizer').remove();
			}

			// Initialize Justified Gallery (justified brick layout)
			$(el).justifiedGallery({
				captions: false,
				lastRow: 'nojustify',
				rowHeight: height,
				margins: margin
			})
				.on("jg.complete", function () {
					// Selector element (accounts for legacy HTML)
					let itemSelector = el.querySelector('.grid-item') ? '.grid-item' : '.gallery-item';
					// Initialize lightGallery (image detail)
					lightGallery(el, {
						licenseKey: '221087FC-1B85-47F8-B1AB-1F7080677FB3',
						selector: itemSelector,
						plugins: [lgZoom, lgThumbnail],
						download: false,
						allowMediaOverlap: false
					});
				});

		});

		// Inline gallery 
		inlineGalleries.forEach(function (el) {
			// console.log('Inline gallery:');
			// console.log(el);

			// Selector elements (accounts for legacy Swiper HTML)
			let containerSelector = el.classList.contains('swiper-container') ? '.gallery_row .swiper-wrapper' : el;
			let itemSelector = el.classList.contains('swiper-container') ? '.swiper-slide' : '.gallery-item';

			const inlineGallery = lightGallery(el, {
				licenseKey: '221087FC-1B85-47F8-B1AB-1F7080677FB3',
				container: containerSelector,
				selector: itemSelector,
				plugins: [lgZoom, lgThumbnail],
				closable: false,
				download: false,
				allowMediaOverlap: false
			});

			inlineGallery.openGallery(0);
		});
	}

}

if (photoGalleries != undefined || inlineGalleries != undefined) new photoGallery();
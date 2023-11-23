---
layout: kitchensink
title: Events
---
<div class="row">
	<div class="column">
		<h2 class="h1">Events <span class="subheading">(feature module)</span></h2>
		
		<p>The events feature module is PHP-based and is compiled from the script at <code>/srv/web/sharedinc/lib/events/events-json-v3.php</code>. Events feed items are pulled in from an API data source at the base route https://api.ontariotechu.ca/v2/events.</p>

		<p>Background colour can be specified using any color key name from {{> main-palette}}.</p>
		{{> spotlight-margins}}

		<section class="events bluegrey">
			<div class="feature-module">
				<div class="heading">
					<h2>Events</h2>
					<a class="see_all" href="https://events.ontariotechu.ca/index.php" title="See all events">All
						events<span></span></a>
				</div>
				<div class="content">
					<div id="events-slider" class="swiper-container">
						<div class="swiper-wrapper">
							<?php
							if (file_exists('/srv/web/sharedinc/lib/events/events-json-v3.php')) include_once('/srv/web/sharedinc/lib/events/events-json-v3.php');
							else include_once('{{root}}php/events-json-v3.php');
							getEvents("https://api.ontariotechu.ca/v2/events", false); 
							?>
						</div>
						<div class="swiper-scrollbar"></div>
					</div>
				</div>
			</div>
		</section>

	</div>
</div>
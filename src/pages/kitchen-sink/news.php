---
layout: kitchensink
title: News
---
<div class="row">
	<div class="column">
		<h2 class="h1">News <span class="subheading">(feature module)</span></h2>
		
		<p>The news feature module is PHP-based and is compiled from the script at <code>/srv/web/sharedinc/lib/news/news-v3.php</code>. News feed items are pulled in from an XML feed, published from the CMS.</p>

		<p>Background colour can be specified using any color key name from {{> main-palette}}.</p>
		{{> spotlight-margins}}

		<pre><code class="language-html">
		&lt;section class="news darkblue bottom-margin">
			&lt;div class="feature-module">
				&lt;div class="heading">
					&lt;h2>Latest news&lt;/h2>
					&lt;a class="see_all" href="http://news.ontariotechu.ca/index.php" title="See all news">All news&lt;span>&lt;/span>&lt;/a>
				&lt;/div>
				&lt;?php
					include_once('/srv/web/sharedinc/lib/news/news-v3.php');
					echo '&lt;div class="content articles">';
					getNews("https://news.ontariotechu.ca/index.xml");
					echo '&lt;/div>';
				?>
			&lt;/div>
		&lt;/section>	
		</code></pre>
		<section class="news darkblue bottom-margin">
			<div class="feature-module">
				<div class="heading">
					<h2>Latest news</h2>
					<a class="see_all" href="http://news.ontariotechu.ca/index.php" title="See all news">All news<span></span></a>
				</div>
				<?php
					if (file_exists('/srv/web/sharedinc/lib/news/news-v3.php')) include_once('/srv/web/sharedinc/lib/news/news-v3.php');
					else include_once('{{root}}php/news-v3.php');
					echo '<div class="content articles">';
					getNews("https://news.ontariotechu.ca/index.xml");
					echo '</div>';
				?>
			</div>
		</section>

		<p>The default news item layout shows one larger news item and three smaller items stacked next to it. Change the layout of the news items using the class <code>.news-grid</code>, which arranges four equally sized images in a row. </p>

		<pre><code class="language-html">
		&lt;section class="news grey margin-bottom">
			&lt;div class="feature-module">
				&lt;div class="heading">
					&lt;h2>Latest news&lt;/h2>
					&lt;a class="see_all" href="http://news.ontariotechu.ca/index.php" title="See all news">All news&lt;span>&lt;/span>&lt;/a>
				&lt;/div>
				&lt;?php
					include_once('/srv/web/sharedinc/lib/news/news-v3.php');
					echo '&lt;div class="content articles">';
					getNews("https://news.ontariotechu.ca/index.xml");
					echo '&lt;/div>';
				?>
			&lt;/div>
		&lt;/section>	
		</code></pre>
		<section class="news news-grid grey margin-bottom">
			<div class="feature-module">
				<div class="heading">
					<h2>Latest news</h2>
					<a class="see_all" href="http://news.ontariotechu.ca/index.php" title="See all news">All news<span></span></a>
				</div>
				<?php
					if (file_exists('/srv/web/sharedinc/lib/news/news-v3.php')) include_once('/srv/web/sharedinc/lib/news/news-v3.php');
					else include_once('{{root}}php/news-v3.php');
					echo '<div class="content articles">';
					getNews("https://news.ontariotechu.ca/index.xml");
					echo '</div>';
				?>
			</div>
		</section>

	</div>
</div>


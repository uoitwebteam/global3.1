---
layout: blank
---
<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
// FOR DEV ONLY, NOT PRODUCTION
$sslcontext = stream_context_create(array('ssl' => array(
	'verify_peer' => false, 
	'verify_peer_name' => false
	)));


/**
 * Renders a news feed
 * 
 * @param $feedURL {string} Feed URL
 * @param $maxItems {int} (Optional) Max number of items to display; default = 4
 * @param $tags {boolean} (Optional) Show category tag; default = false
 * @param $backfill {boolean} (Optional) If item count is less than max, backfill with main news feed; default = true
 */ 
function getNews($feedURL, $maxItems = 4, $tags = false, $backfill = true) {
	global $sslcontext;
	libxml_set_streams_context($sslcontext); // FOR DEV ONLY; NOT PRODUCTION
  $newsXML = simplexml_load_file($feedURL);

  if (!$newsXML) echo 'Visit news.ontariotechu.ca to see all news.';

	// Render feed items
	displayItems($newsXML->channel->item, $maxItems, $tags);

	// Backfill with university news
	if ($newsXML->channel->item->count() < $maxItems && $backfill) {
		libxml_set_streams_context($sslcontext); // FOR DEV ONLY; NOT PRODUCTION
		$newsMainXML = simplexml_load_file('https://news.ontariotechu.ca/index.xml');
		$limit = $maxItems - $newsXML->channel->item->count();
		displayItems($newsMainXML->channel->item, $limit, $tags);
	}
}

function displayItems($itemNodes, $maxItems, $tags) {
	$itemCount = 1;
	foreach($itemNodes as $news) {
        if ($itemCount <= $maxItems) {
            $title = $news->title;
            $link = $news->link;
    
            $image = $news->children('http://search.yahoo.com/mrss/')->content->attributes();
            $src = $image['url'];
            $alt = $image['description'];
            $src = preg_replace("/^http:/i", "https:", $src);
    
            $date = strtotime($news->pubDate);
        	$dateDisplay = date("F j, Y", $date);
        	$tag = $news->category;
    
          echo "<article>
                <div>
                    <a class=\"link\" href=\"$link\" onclick=\"ga('send', 'event', 'link', 'click', 'newsFeed_$link');\"><span class=\"show-for-sr\">$title</span></a>
                    <div class=\"news_img\">
                        <img src=\"$src\" alt=\"$alt\"/>
                    </div>
    				<div class=\"news_text\">";
    				if ($tags)echo "<p class=\"news_tag\"><span>$tag</span></p>";
    				else echo "<p class=\"news_date\">$dateDisplay</p>";
    
    				echo "<p class=\"news_title\">$title</p>";
    
    				if ($tags) echo "<p class=\"news_date\">$dateDisplay</p>";
    			echo "</div>
                </div>
            </article>";  
    
          $itemCount++;
        }
	}
}
?>
---
layout: blank
---
<?php
ini_set('display_errors',1);
error_reporting(E_ALL);


function get_url_content($url) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
  curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // FOR DEV ONLY, NOT PRODUCTION
	
  $data     = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  
	// echo $httpcode;
	// echo curl_error($ch);
	// print_r($data);
	curl_close($ch);
	// return $data;
  return ($httpcode >= 200 && $httpcode < 300) ? $data : false;
}

function parseLocation($event, $buildings) {
  $result   = '';
  $campus   = $event->location_campus;
  $building = $event->location_building;
  $room     = $event->location_room;
  $other    = $event->location_other;
  $building = $building != 0 ? $buildings[ $building ] : '';
  if ($campus != 2) {
    $result .= $campus == 0 ? 'North Oshawa Location' : 'Downtown Oshawa Location';
    if ($building) {
      $result .= ', ' . $building = ($building) ? $building : '';
    }
    if ($room) {
      $result .= ', ' . $room = ($room) ? $room : '';
    }
  } else {
    $result = $other;
  }
  return $result;
}

function getEvents($feedURL, $backfill = 0) {
  $feedURL   = str_replace('/v2/events/rss', '/v2/events', $feedURL);
  $feedURL   = str_replace('/v1/rss', '/v1/events', $feedURL);
  $events    = json_decode(get_url_content($feedURL));
  $buildings = json_decode(get_url_content('https://api.ontariotechu.ca/v2/events/buildings'), true);
	// print_r($events);
  $minItems  = 5;
  $maxItems  = 12;
  $itemCount = 1;
  foreach ($events as $event) {
    if ($itemCount <= $maxItems) {
      $title       = $event->event_name;
      $description = $event->event_description;
      $url         = 'https://events.ontariotechu.ca/event/' . $event->id;
      $unixdate    = strtotime($event->event_startdate);
      $date        = new DateTime();
      $date->setTimestamp((int) $unixdate);
      $monthDisplay = $date->format('M');
      $dayDisplay   = $date->format('j');
      $ampm         = date('a', $unixdate) == 'am' ? ' a.m.' : ' p.m.';
      if (date('i', $unixdate) == '00') {
        if (date('G', $unixdate) == '12') {
          $time = 'Noon';
        } else {
          $time = date('g', $unixdate) . $ampm;
        }
      } else {
        $time = date('g:i', $unixdate) . $ampm;
      }
      $location = parseLocation($event, $buildings);
      echo "<div class='swiper-slide'>".
        "<a href=\"$url\" target=\"_blank\" data-label=\"$title\">".
          "<p class=\"event_date\">$monthDisplay ".
            "<span>$dayDisplay</span>".
          "</p>".
          "<p class=\"event_info\">".
            "<span class=\"event_title\">$title</span>".
            "<span class=\"event_time\">$location<br>$time</span>".
          "</p>".
        "</a>".
      "</div>";
      $itemCount++;
    }
  }

  if ($itemCount <= 5 && $backfill == '1') {
    getEvents("https://api.ontariotechu.ca/v2/events");
  }
}
?>
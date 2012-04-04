<?php

$access_token="185075494917696|CJsNTF5G5-EjbMfd7wfAkrWfsII";


$ch = curl_init();
//curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/adam.krebs/feed?access_token=$access_token&message=I like turtles.");
curl_setopt($ch, CURLOPT_URL, Ôhttp://news.google.com/news?hl=en&topic=t& output=rssÕ);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$contents = curl_exec($ch);

print_r($contents);
curl_close($ch);

?>
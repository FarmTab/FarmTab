<?php

if ($_REQUEST['SESSION']) {
	print "nope.";
	exit(999);
}

function make_password($pass, $salt=generateSalt()) {
	return base64_encode(sha1($pass . $salt, true) . $salt);
}
	
	
/** @author AfroSoft <info@afrosoft.tk> */
function generateSalt($max = 15) {
	$characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	$i = 0;
	$salt = "";
	do {
		$salt .= $characterList{mt_rand(0,strlen($characterList)-1)};
		$i++;
	} while ($i < $max);
	return $salt;
}


?>
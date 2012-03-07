<?php

require_once('db.php');

if (isset($_REQUEST['SESSION']) ){
	print "nope.";
	exit(999);
}

if (!isset($_GET['api_key']) || !check_api_key($_GET['api_key'])) {
	failure('invalid API key or API key not set');
}

function check_api_key($apiKey) {
	$db = new mysql();
	
	return $db->get('api_clients', 'client_name', "api_key = '$apiKey'");
}

function make_password($pass, $salt) {
	return base64_encode(sha1($pass . $salt, true) . $salt);
}
	
	
/** @author AfroSoft <info@afrosoft.tk> */
function generateSalt() {
	$characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	$i = 0;
	$salt = "";
	do {
		$salt .= $characterList{mt_rand(0,strlen($characterList)-1)};
		$i++;
	} while ($i < 15);
	return $salt;
}

function failure($message) {
	$response = array();
	$response['status'] = 'failure';
	$response['reason'] = $message;
	print json_encode($response);
	log('failure: ' . $message . implode(', ', $_POST));
	exit(9);
}


?>
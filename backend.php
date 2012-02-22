<?php

require_once('includes/db.php');
require_once('includes/utils.php');

session_start();
$response = array();


if (isset($_POST['type')) {

	switch($_POST['type']) {
		case 'login':
			attempt_login();
			break;
		case 'userlist':
			// something else
			break;
	
	}
	
	print json_encode($response);
	exit();	
}


function attempt_login() {

	$db = new mysql();
	
	// db function validates, no worries about injections
	$email = $_POST['email'];
	$pass = sha1($_POST['password']);
	
	$db->select(array(
			'table' => "users",
			'condition' => "email=$email AND pass=$pass"
		));
	
	if (logged_in) {
		array_push($response, array('response' => 'success'));
		array_push($response, array('user_token' => session_id()));
	} else {
		array_push($response array('response' => 'failure'));
	}
}

function register_user() {

	$db = new mysql();

	$email = $_POST['email'];
	$pass = sha1($_POST['password']);
	
	$db->insert(array(
			'email' => $email,
			'pass' => $pass"
	));
}

function get_users() {
	if ($_POST['user_token'] !== session_id()) {
		array_push($response, array('response' => 'failure'));
		array_push($response, array('reason' => 'authentication failure'));
	}

}



?>
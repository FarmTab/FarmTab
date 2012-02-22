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
			get_users($_POST['farmId']);
			break;
	}
	
	print json_encode($response);
	exit();	
}


function attempt_login() {

	$db = new mysql();
	
	// db function validates, no worries about injections
	$email = $_POST['email'];
	$salt = $db->get('users', 'salt', "email=$email") or failure('Could not find user');
	$pass = make_password($_POST['password'], $salt);
	
	$db->select(array(
			'table' => "users",
			'condition' => "email=$email AND pass=$pass"
		)) or failure('Could not log in');
	
	$response['status'] = 'success';
	$response['data'] = array('user_token' => session_id());
	
}

function register_user() {

	$db = new mysql();

	$email = $_POST['email'];
	$salt = generate_salt();
	$pass = make_password($_POST['password'], salt);
	
	$db->insert(array(
			'email' => $email,
			'pass' => $pass
	)) or failure('could not insert');
}

function get_users($farmId) {
	if ($_POST['user_token'] !== session_id())
		failure('authentication failure');
	
	$db = new mysql();
	
	$users = $db->select(array(
		'table' => "farmers",
		'condition' => "farmId=$farmId"
	));
	
	if (!$users)
		failure('could not fetch users');
			
	$response['status'] = 'success';
	$response['data'] = $users;

}

function get_balance($userId) {
	$db = new mysql();
	
	$bal = $db->get('users','balance', "userId = $userId");
	
	$response['status'] = 'success';
	$response['data'] = array('balance' => $bal);
}


function failure($message) {
	$response['status'] = 'failure';
	$response['reason'] = $message;
	print json_encode($response);
	exit(9);
}



?>
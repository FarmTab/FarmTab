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
		case 'transaction':
			process_transaction($_POST['userId'], $_POST['amount']); // needs moar security
			break;
		case 'userlist':
			get_users($_POST['farmId']);
			break;
		case 'validate':
			validate_pin($_POST['userId'], $_POST['PIN']);
			break;
	}
	
	print json_encode($response);
	exit();	
}


function attempt_login() {

	$db = new mysql();
	
	// db function validates, no worries about injections
	$email = $_POST['email'];
	$salt = $db->get('farmers', 'salt', "email=$email") or failure('Could not find user');
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
	$PIN = make_password($_POST['PIN'], $salt);
	
	$db->insert('users', array(
			'email' => $email,
			'PIN' => $PIN,
			'salt' => $salt,
			'farmId' => $farmId
	)) or failure('could not insert');
	
	$userId = $db->get('users', 'userId', "email=$email");
	
	$response['status'] = 'success';
	$response['data'] = array('userId' => $userId);
}

function get_users($farmId) {
	if ($_POST['user_token'] !== session_id())
		failure('authentication failure');
	
	$db = new mysql();
	
	$users = $db->select(array(
		'table' => "users",
		'condition' => "farmId = $farmId"
	));
	
	if (!$users)
		failure('could not fetch users');
			
	$response['status'] = 'success';
	$response['data'] = $users;

}

function get_balance($userId) {
	$db = new mysql();
	
	$bal = $db->get('users','balance', "userId = $userId");
	
	if (!$bal)
		failure('could not find user balance');
	
	$response['status'] = 'success';
	$response['data'] = array('balance' => $bal);
}

function process_transaction($userId, $amount) {
	$db = new mysql();
	
	$currentBal = $db->get('users', 'balance', "userId=$userId");
	
	$newBal = $currentBal - $amount;
	
	if ($newBal <= 0)
		failure('Balance too low to process transaction');
	
	$db->update('users', array('balance' => $newBal), "userId=$userId");
}

function validate_pin($userId, $PIN) {
	$db = new mysql();
	
	$result = $db->row(array(
			'table' => "users",
			'fields' => "PIN, salt, balance",
			'condition' => "userId=$userId"
		)) or failure('Could not find user');
	$PIN1 = $result['PIN'];
	$PIN2 = make_password($_POST['PIN'], $result['salt']);
	
	if ($PIN1 !== $PIN2)
		failure('Authentication failure, PIN invalid');
		
	$response['status'] = 'success';
	$response['data'] = array('balance' => $result['balance']);	
}


function failure($message) {
	$response['status'] = 'failure';
	$response['reason'] = $message;
	print json_encode($response);
	log('failure: ' . $message . implode(', ', $_POST));
	exit(9);
}



?>
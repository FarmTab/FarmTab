<?php

require_once('includes/db.php');
require_once('includes/utils.php');

session_start();
$response = array();

header('Content-Type: application/json charset=UTF-8');

if (isset($_POST['type')) {

	switch($_POST['type']) {
		case 'login':
			attempt_login($_POST['email'], $_POST['password']);
			break;
		case 'logout':
			logout_farmer();
			break;
		case 'transaction':
			process_transaction($_POST['userId'], $_POST['amount'], $_POST['token']);
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


function attempt_login($email, $pass) {

	$db = new mysql();
	
	// db function validates, no worries about injections
	$salt = $db->get('farmers', 'salt', "email=$email") or failure('Could not find user');
	$hashedPass = make_password($pass, $salt);
	
	$response = $db->select(array(
			'table' => "farmers",
			'fields' => "farmId",
			'condition' => "email=$email AND pass=$hashedPass"
		)) or failure('Could not log in');
	
	
	session_regenerate_id (); // for security
    	$_SESSION['valid'] = true;
    	$_SESSION['farmId'] = $response['farmId'];
	
	$response['status'] = 'success';
	$response['data'] = array('user_token' => session_id(), 'farmId' => $response['farmId']);
	
}

function logout_farmer() {
	$_SESSION = array();
    	session_destroy();
}

function register_user() {

	$db = new mysql();

	$email = $_POST['email'];
	$salt = generate_salt();
	$PIN = make_password($_POST['PIN'], $salt);
	$farmId = $_SESSION['farmId'];
	
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

function setToken($userId) {
	$_SESSION['token_timestamp'] = time();
	$_SESSION['token'] = uniqid($userId);
	return $_SESSION['token'];	
}

function checkToken($token) {
	if ($token !== $_SESSION['token'])
		return false;
	if (time() - $_SESSION['token_timestamp'] > 120000) // 2 minutes timeout
		return false;
	return true;
}


function process_transaction($userId, $amount, $token) {
	$db = new mysql();
	
	if (!checkToken($token))
		failure('token mismatch failure');
	
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
		
	$token = setToken($userId);
		
	$response['status'] = 'success';
	$response['data'] = array('balance' => $result['balance'], 'token' => $token);	
}

?>
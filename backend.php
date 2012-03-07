<?php

require_once('includes/db.php');
require_once('includes/secrets.php');
require_once('includes/utils.php');

session_start();
static $response = array();

header('Content-Type: application/json charset=UTF-8');

if (isset($_GET['type'])) {

	switch($_GET['type']) {
		case 'login':
			$response = attempt_login($_POST['email'], $_POST['password']);
			break;
		case 'logout':
			$response = logout_farmer();
			break;
		case 'transaction':
			$response = process_transaction($_POST['userId'], $_POST['transaction'], $_POST['token']);
			break;
		case 'userlist':
			$response = get_users($_GET['farmId']);
			break;
		case 'validate':
			$response = validate_pin($_POST['userId'], $_POST['pin']);
			break;
	}
	
	print json_encode($response);
	exit();	
}


function attempt_login($email, $pass) {

	$db = new mysql();
	
	// db function validates, no worries about injections
	$salt = $db->get('farm', 'salt', "email=$email") or failure('Could not find farmer');
	$hashedPass = make_password($pass, $salt);
	
	$response = $db->select(array(
			'table' => "farm",
			'fields' => "id",
			'condition' => "email=$email AND pass=$hashedPass"
		)) or failure('Could not log in');
	
	
	session_regenerate_id (); // for security
    $_SESSION['valid'] = true;
    $_SESSION['farmId'] = $response['id'];
	
	$response['status'] = 'success';
	$response['data'] = array(
			'user_token' => session_id(),
			'farmId' => $response['id']
	);
	return $response;
}

function logout_farmer() {
	$_SESSION = array();
    session_destroy();
    $response['status'] = "success";
    return $response;
}

function checkLogin() {
	if (!isset($_SESSION['valid']) && $_SESSION['valid'])
		failure('Authentication error');
	return true;
}

function register_user($email, $pin) {
	
	checkLogin();

	$db = new mysql();

	$salt = generate_salt();
	$hashedPin = make_password($pin, $salt);
	$farmId = $_SESSION['farmId'];
	
	$userId = $db->insert('user', array(
			'email' => $email,
			'pin' => $hashedPin,
			'salt' => $salt
	)) or failure('could not insert');
	
	$db->insert('farm_x_user', array(
			'farm_id' => $farmId,
			'user_id' => $userId
	));
	
	$response['status'] = 'success';
	$response['data'] = array('userId' => $userId);
	
	return $response;
}

function get_users($farmId) {
	
	//checkLogin();
	
	$db = new mysql();
	
	$user_ids = $db->select(array(
		'table' => "farm_x_user",
		'fields' => "user_id",
		'condition' => "farm_id = $farmId"
	)) or failure('invalid farm id');
	
	
	$ids = "('";
	foreach ($user_ids as $id) {
		if ($multi)
			$ids .= "',";
		$ids .= $id['user_id'];
		$multi = true;
	}
	$ids .= "')";
	
			
	$users = $db->select(array(
		'table' => "user",
		'fields' => "id, name, balance, img_url",
		'condition' => "`id` IN " . $ids
	)) or failure('could not fetch users');
			
	$response['status'] = 'success';
	$response['data'] = $users;
	
	return $response;
}

function get_balance($userId) {
	
	checkLogin();
	
	$db = new mysql();
	
	$bal = $db->get('user','balance', "id = $userId");
	
	if (!$bal)
		failure('could not find user balance');
	
	$response['status'] = 'success';
	$response['data'] = array('balance' => $bal);
	
	return $response;
}

function setToken($userId) {

	$agent = $_SERVER['HTTP_USER_AGENT'];
	$agent .= 'SHIFLETT';

	$token = md5($agent . secrets::TOKEN_SECRET . $userId);

	$_SESSION['token_timestamp'] = time();
	$_SESSION['token'] = $token;
	return $_SESSION['token'];	
}

function checkToken($token) {
	if ($token !== $_SESSION['token'])
		return false;
	if (time() - $_SESSION['token_timestamp'] > 120000) // 2 minutes timeout
		return false;
	return true;
}


function process_transaction($userId, $transaction, $token) {
	
	checkLogin();
	
	$db = new mysql();
	
	if (!checkToken($token))
		failure('token mismatch failure');
	
	$currentBal = $db->get('user', 'balance', "userId=$userId");
	
	$newBal = $currentBal - $transaction['amount'];
	
	if ($newBal <= 0)
		failure('Balance too low to process transaction');
		
	$transactionId = $db->insert('transaction', $transaction);
	
	$db->insert('user_x_transaction', array(
					'user_id' => $userId,
					'transaction_id' => $transactionId
	));
	
	$db->update('user', array('balance' => $newBal), "id=$userId");
	
	$response['status'] = "success";
	$response['data'] = array('balance' => $newBal);
	
	return $response;
}

function validate_pin($userId, $pin) {
	
	checkLogin();
	
	$db = new mysql();
	
	$result = $db->row(array(
			'table' => "user",
			'fields' => "pin, salt, balance",
			'condition' => "userId=$userId"
		)) or failure('Could not find user');
	$PIN1 = $result['pin'];
	$PIN2 = make_password($pin, $result['salt']);
	
	if ($PIN1 !== $PIN2)
		failure('Authentication failure, PIN invalid');
		
	$token = setToken($userId);
		
	$response['status'] = 'success';
	$response['data'] = array(
		'balance' => $result['balance'],
		'token' => $token
	);	
	
	return $response; 
}

?>
<?php

require_once('includes/db.php');
require_once('includes/secrets.php');
require_once('includes/utils.php');

session_start();
$response = array();

header('Content-Type: application/json charset=UTF-8');

if (isset($_GET['type'])) {

	switch($_GET['type']) {
		case 'login':
			$response = attempt_login($_POST['email'], $_POST['password']);
			break;
		case 'register':
			$response = register_user($_POST['email'], $_POST['pin'], $_POST['farmId']);
			break;
		case 'linkuser':
			$response = link_user($_GET['userId'],$_GET['farmId']);
			break;
		case 'transaction':
			$response = process_transaction($_POST['userId'], $_POST['transaction']);
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
			'farmId' => $response['id']
	);
	return $response;
}

function register_user($email, $pin, $farmId) {
	checkLogin();

	$db = new mysql();
	
	if ($farmId != $_SESSION['farmId'])
		failure("can't register users to farms you don't own.");

	$salt = generate_salt();
	$hashedPin = make_password($pin, $salt);
	
	$userId = $db->insert('user', array(
			'email' => $email,
			'pin' => $hashedPin,
			'salt' => $salt
	)) or failure('could not register user');
	
	$db->insert('farm_x_user', array(
			'farm_id' => $farmId,
			'user_id' => $userId
	));
	
	$tabId = $db->insert('tab', array(
			'farm_id' => $farmId,
			'user_id' => $userId,
			'balance' => "0.00"
	));
	
	$db->insert('user_x_tab', array(
			'user_id' => $userId,
			'tab_id' => $tabId
	));
	
	$response['status'] = 'success';
	$response['data'] = array('userId' => $userId);
	
	return $response;
}

function link_user($userId, $farmId) {
	checkLogin();
	
	$db = new mysql();
	
	if ($farmId !== $_SESSION['farmId'])
		failure("can't link users to farms you don't own.");
	
	$db->execute("INSERT INTO farm_x_user (farm_id, user_id) VALUES ($farmId, $userId)");
	$db->execute("INSERT INTO tab (farm_id, user_id, balance) VALUES ($farmId, $userId, 0.00)");
	$db->execute("INSERT INTO user_x_tab (user_id, tab_id) VALUES ($userId, LAST_INSERT_ID())");
	
	if (mysql_error())
		failure("Couldn't insert into db: " . mysql_error());
	
	$response['status'] = 'success';
	$response['data'] = array('message' => "inserted successfully");
	
	return $response;	
}

function get_users($farmId) {
	
	checkLogin();
	
	$db = new mysql();
	
	$users = $db->query(
			"SELECT user.id, user.name, user.img_url, tab.balance
			FROM user
			INNER JOIN farm_x_user fx
			    ON fx.user_id = user.id
			INNER JOIN tab
			    ON tab.user_id = user.id AND tab.farm_id = $farmId
			WHERE fx.farm_id = $farmId"
			, false, false);
			
	$response['status'] = 'success';
	$response['data'] = $users;
	
	return $response;
}

function get_balance($userId) {
	
	checkLogin();
	
	$db = new mysql();
	
	$bal = $db->get('tab','balance', "user_id='$userId' AND farm_id='$farmId'")
					or failure('could not find user balance');
	
	$response['status'] = 'success';
	$response['data'] = array('balance' => $bal);
	
	return $response;
}


function process_transaction($userId, $transaction) {
	
	checkLogin();
		
	$db = new mysql();
	
	$currentBal = $db->get('tab', 'balance', "user_id='$userId' AND farm_id='$farmId'")
						or failure('could not find user balance');
	
	$newBal = $currentBal - $transaction['amount'];
	
	if ($newBal < 0)
		failure('Balance too low to process transaction');
		
	$transactionId = $db->insert('transaction', $transaction);
	
	$db->insert('user_x_transaction', array(
			'user_id' => $userId,
			'transaction_id' => $transactionId
		));
	
	$db->update('tab', array('balance' => $newBal), "user_id='$userId' AND farm_id='$farmId'");
	
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
<?php

	/*** no presentation in this file. Use register.html instead ***/


	require_once("includes/db.php");
	
	$db = new mysql();
	
	// escape whole POST query
	$_POST = array_map(mysql_real_escape_string, $_POST);
	
	if ( !validate() ) {
		error_log("VALIDATE ERROR");
		exit("Error validating form.");
	}
	
	
	$data = array(
		'name' => $_POST['name'],
		'email' => $_POST['email'],
		'pin' => $_POST['pin']
	);
	
	$result = $db->insert($data);
	
	if ($result) {
		header("Location: transaction.php?userid=$result ");
	} else {
		exit("Error inserting into db! " . mysql_error());
	}
	
	
	/******************************************
		field validate functions
	******************************************/
	function validate() {
		echo "validating";
		if ( !validate_name() ) {
			return false;
		}
		if ( !validate_email() ) {
			return false;
		}
		if ( !validate_pin() ) {
			return false;
		}
		return true;
	}
	
	function validate_name() {
		$name = $_POST['name'];
		if ( strlen($name) == 0 ||
			strlen($name) > 256 ) {
			error_log("name outside of length range! length: " . strlen($name));
			return false;
		}
		return true;
	}
	
	function validate_email() {
		$email = $_POST['email'];
		// yeah, I know this isn't perfect. It'll do for now. 
		return filter_var($email, FILTER_VALIDATE_EMAIL);
	}
	
	
	function validate_pin() {
		$pin = $_POST['pin'];
		if ( strlen($pin) != 4 ) {
			error_log("pin length not 4! actual length: " . strlen($pin));
			return false;
		}
		if ( !is_numeric($pin) ) {
			error_log("pin not numeric! pin: $pin");
			return false;
		}
		if ( $pin != $_POST['pin2'] ) {
			error_log("pin and pin2 not equal! pin1: $pin, pin2: {$_POST['pin']}");
			return false;
		}
		return true;
	}

?>
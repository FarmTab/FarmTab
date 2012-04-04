<?php

	require_once("includes/db.php");
	
	$db = new mysql();

	$id = mysql_real_escape_string($_GET['id']);
	$amount = sprintf("%01.2f",mysql_real_escape_string($_POST['amount']));
	
	$data = array();
if($_POST['credit-type']=='add') {
		$balance = sprintf("%01.2f",$db->get('user','balance',"id=$id"));
		$balance += $amount;
		$data = array(
			'balance' => $balance
		);
		$result = $db->update('user',$data,"id=$id");
		header("Location: transaction.php?id=$id");
	} else if ($_POST['credit-type'] == 'remove') {
		$name = $db->get('user','name',"id=$id");
		header("Location: confirm.php?id=$id&name=$name&amount=$amount");
	} else {
		error_log("PROBLEM WITH MODIFY CREDIT");
		exit("error in modify credit mod_credit.php");
	}
	
	
	$db->__destruct();
	
	
		
?>
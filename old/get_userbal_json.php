<?php

	require_once("includes/db.php");

	$db = new mysql();
	$id = mysql_real_escape_string($_GET['id']);

	$balance = $db->get('user','balance',"id=$id");
	$db->__destruct();
	
	return json_encode($balance);	

?>
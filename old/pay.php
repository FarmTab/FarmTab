<?
	require_once("includes/db.php");
	
	$db = new mysql();
	$id = mysql_real_escape_string($_GET['id']);
	$amount = sprintf("%01.2f",mysql_real_escape_string($_POST['amount']));
		
	$balance = sprintf("%01.2f",$db->get('user','balance',"id=$id"));
	$balance = $balance - $amount;
	$data = array(
		'balance' => $balance
	);
	$result = $db->update('user',$data,"id=$id");
	
	exec("curl -F 'access_token=185075494917696|CJsNTF5G5-EjbMfd7wfAkrWfsII' \
     -F 'message=Just bought some delicious bagels at Joshuas farm stand!' \
     https://graph.facebook.com/adam.krebs/feed");
	
	
	/*
	
	require_once('includes/facebook.php');

	$config = array(
		'appId' => '185075494917696',
		'secret' => 'f8d7f485cb2a9567b49f6be9a7fb90ab',
	);
	
	$facebook = new Facebook($config);
	
	$facebook->api('/me/feed', 'POST',
        array(
          'link' => 'www.farmtab.net',
          'message' => 'Just bought some delicious bagels at Joshua\'s farm stand!'
     ));
	*/
	
	
	header("Location: transaction.php?id=$id");
	
?>
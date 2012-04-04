<!DOCTYPE html> 
<html> 
	<head> 
	<title>Transaction</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />
	<link rel="stylesheet" href="ft_mobile.css" />
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
	
	
	<script type="text/javascript" >
	
	
	
	</script>
	

</head> 
<body> 

<?php
	//require_once("user.php");
	require_once("includes/db.php");
	$db = new mysql();
	
	$id = mysql_real_escape_string($_GET['id']);
	
	// dumb, dumb. but db->get isn't working now. screw it
	$balance = sprintf("%01.2f",$db->get('user','balance',"id=$id"));
	$name = $db->get('user','name', "id=$id");
	//$user = User::get_user_by_id($id);

?>
<div data-role="page" id="checkout">

	<div data-role="header">
		<img src="img/carrot.png" class="ui-btn-left" alt="" height="30px"/>
		<a href="userlist.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-right jqm-home">Home</a>
		<h1>Transaction</h1>
	</div><!-- /header -->

	<div data-role="content">	
			<h3><?= $name ?> <span style="color: green">$<?= $balance ?></span></h3>	
		<form id="modifycredit" method="post" action="mod_credit.php?id=2" data-ajax="false">

			<label for="amount" class="ui-hidden-accessible">Amount</label>
			<input id="amount" name="amount" type="number" placeholder="Amount" required="required"/>
	
		<fieldset class="ui-grid-a">
				<div class="ui-block-a"><button type="submit" data-theme="d" name="credit-type" value="add">Add</button></div>
				<div class="ui-block-b"><button type="submit" data-theme="a" name="credit-type" value="remove">Remove</button></div>
	    </fieldset>

			

			
		</form>

	</div><!-- /content -->

</div><!-- /page -->

</body>
</html>
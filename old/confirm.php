<!DOCTYPE html> 
<html> 
	<head> 
	<title>Register for Farmtab</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />
	<link rel="stylesheet" href="ft_mobile.css" />
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
	<script type="text/javascript" src="http://jzaefferer.github.com/jquery-validation/jquery.validate.js"></script>
</head> 
<body> 

<div data-role="page">

	<div data-role="header">
		<img src="img/carrot.png" class="ui-btn-left" alt="" height="30px"/>
		<h1>Confirm Transaction</h1>
		<a href="transaction.html" data-icon="delete" data-iconpos="notext" data-direction="reverse" class="ui-btn-right">Home</a>
	</div><!-- /header -->

	<div data-role="content">
		<form name="pay" method="post" action="pay.php?id=<?= $_GET['id'] ?>" autocomplete="off" data-ajax="false">
			<p><?= $_GET['name']; ?>, please enter PIN to confirm payment of $<?= $_GET['amount']; ?></p>
			<input type="hidden" name="amount" value="<?= $_GET['amount'] ?>" />
			<label for="pin" class="ui-hidden-accessible">PIN</label>
			<input id="pin" name="pin" class="pin" maxlength="4" size="4" type="number" placeholder="4-digit PIN" required />
			
			<input type="checkbox" checked="true" name="facebook" id="facebook" class="custom" />
			<label for="facebook">Post to Facebook</label>

			<input type="submit" value="Confirm" />
		</form>
	</div><!-- /content -->
	
</div>

</html>
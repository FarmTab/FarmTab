
<!DOCTYPE html> 
<html> 
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<title>ID Verify</title> 
	<link rel="stylesheet"  href="//code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />  
	<link rel="stylesheet" href="../_assets/css/jqm-docs.css"/>
	<script src="//code.jquery.com/jquery-1.6.4.js"></script>
	<script src="../../experiments/themeswitcher/jquery.mobile.themeswitcher.js"></script>
	<script src="../_assets/js/jqm-docs.js"></script>
	<script src="//code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
</head> 
<body> 

<div data-role="page">
	

		<div data-role="content" data-theme="c" style="text-align:center">
			<p>Is this <?= $_GET['name']; ?>?</p>
			<img height="220px" src="img/<?= $_GET['id']; ?>.jpg" />
			<a href="transaction.php?id=<?= $_GET['id']; ?>" data-role="button" data-theme="b">Yes</a>       
			<a href="userlist.html" data-role="button" data-rel="back" data-theme="c">No</a>    
		</div>
	</div>


</body>
</html>
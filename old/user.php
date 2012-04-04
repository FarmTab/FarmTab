<?php
/*************************************
	User model
*************************************/

require_once("includes/db.php");

class User_Helper {
	private $user;
	private static $users;
	
	private function __construct( $user ) {
		$this->user = $user;
	}
	
	static function get_user_by_id( $user_id ) {
	    if (!array_key_exists($user, self::$users)) {
			$db = db_connect();
			$user_id = mysql_real_escape_string($user_id);
			$db->row(array(
				'table' => 'user',
				'condition' => "id=$user_id"
			));
			
			$db->__destruct();
			self::$users[$user] = new User($row);
		}
		
		return self::$users[$user];
	}

}

class User {
	var $name;
	var $id;
	var $imgurl;
	var $balance;
	
	var $last_update_time; // in unix time
	
	 
	function __construct( $obj ) {
		$this->name = $obj['name'];
		$this->id = $obj['id'];
	}
	
	
	
	function get_balance() {
	
		if ( time() - $last_update_time < 5000 ) {
			return $balance;
		}
	
		$db = db_connect();
		$this->balance = $db->get('user','balance',"id=$id");
		$this->last_update_time = time();
		$db->__destruct();
		
		return $balance;	
	}
	
	function update_balance( $newbal ) {
		$db = db_connect();
		$data = array(
			'balance' => $newbal
		);
		
		$db->update('user',$data,"id=$id")
	}
	
	
 	
 	function db_connect() {
 		require_once("includes/db.php");
 		return new mysql();
 	}
}

?>
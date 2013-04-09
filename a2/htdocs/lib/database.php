<?php

class Database{

	const DB_HOST = "dbsrv1";
	const DB_USERNAME = "c2gamage";
	const DB_PASSWORD = "reyoobah"; //iefoowup
	const DB_NAME = "csc309h_c2gamage";

	private $mysqli = NULL;

	public function __construct(){
		$this->dbConnect();
	}

	public function __destruct(){
		$this->dbDisconnect();
	}

	private function dbConnect(){
		//new Response("connecting to " . self::DB_NAME . " ...\n");

		$this->mysqli = new mysqli(self::DB_HOST, self::DB_USERNAME, self::DB_PASSWORD, self::DB_NAME);

		if ($this->mysqli->connect_error)
			die('Connect Error (' .$this->mysqli->connect_errno . ') '. $this->mysqli->connect_error);
	}

	private function dbDisconnect(){
		//new Response("\ndisconnecting from " . self::DB_NAME . " ...");
		$this->mysqli->close();
	}

	public function query($string){
		$query = $this->mysqli->query($string);
		if (!$query)
			new Response ('failed query: '.$string." message: ". $this->mysqli->error . "\n");
		return $query;
	}
}

?>

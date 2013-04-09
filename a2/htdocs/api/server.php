<?php
require("blog.php");
require("trends.php");
require("response.php");
require("./lib/database.php");
require("./lib/tumblr.php");
require("./lib/queries.php");

class Server {

	public function __construct(){
		$this->router();
	}

	public function router(){

		if ($_SERVER['REQUEST_METHOD'] == "POST")
			new Blog();
		else if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET['all']))
			new Trends();
		else
			new Response('', 404);
	} 
}
?>

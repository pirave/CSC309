<?php

class Response{
	public function __construct($data, $status=null)
    {
    	$code = $status ? $status : 200;
        # Set http header
        header("HTTP/1.1 " . $code);
        header("Content-Type:application/json");
        echo $data;
    } 
}

?>
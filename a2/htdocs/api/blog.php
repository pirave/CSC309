<?php

class Blog{

	private $db = NULL;
	private $queries = NULL;

	public function __construct(){
		$this->db = new Database();			// connect to the database
		$this->queries = new Queries();		// connect to the database

		new Response($_POST['blog'] . " is now being tracked.\n");

		$this->addBlog($_POST['blog']);
	}

	public function addBlog($bid){
		$tumblr = new Tumblr();
		$posts = $tumblr->getPosts($bid);
		$this->_insertPosts($posts);
		$this->_insertBlogs($bid, $posts);
		$this->_insertTracks ($posts);
	}

	private function _insertPosts($posts){
		
		$query = "INSERT IGNORE INTO posts (pid, url, text, image, date, last_count, blog_name) VALUES";

		foreach ($posts as $post)
			$query .= $this->queries->insertPostValues(
				$post['pid'], 
				$post['url'], 
				$post['text'], 
				$post['image'], 
				$post['date'], 
				$post['last_count'],
				$post['blog_name']);

		$this->db->query(rtrim($query, ","));
	}

	private function _insertBlogs($bid, $posts){
		$query = "INSERT IGNORE INTO blogs (bid, pid) VALUES";

		foreach ($posts as $post) 
			$query .= $this->queries->insertBlogValues(
				$bid, 
				$post['pid']);

		$this->db->query(rtrim($query, ","));
	}
	
	private function _insertTracks($posts){
		$query = "INSERT INTO tracks (pid, inc, count) VALUES";

		foreach($posts as $post){
			$value = "";
			$value .= $this->queries->insertTrackValues(
				$post['pid'],
				$post['last_count']);

			if ($value)
				$this->db->query(rtrim($query.$value, ","));
		}
	}

}

?>

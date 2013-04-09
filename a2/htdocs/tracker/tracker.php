<?php
require("/h/u11/c2/00/c2gamage/csc309/A2/apache/htdocs/lib/database.php");
require("/h/u11/c2/00/c2gamage/csc309/A2/apache/htdocs/lib/tumblr.php");
require("/h/u11/c2/00/c2gamage/csc309/A2/apache/htdocs/api/response.php");
require("/h/u11/c2/00/c2gamage/csc309/A2/apache/htdocs/lib/queries.php");
ini_set('max_execution_time', 300);

class Tracker{
	private $db = NULL;
	private $tumblr = NULL;
	private $queries = NULL;

	public function __construct(){
		$this->db = new Database();
		$this->tumblr = new Tumblr();
		$this->queries = new Queries();
	}

	public function updateBlogs() {

		$result = $this->db->query("SELECT DISTINCT bid FROM blogs");
		$blogs = array();
		$result->data_seek(0);

		while ($bid = $result->fetch_assoc()){
            $blogs[] = $bid['bid'];
        }

        $this->db->query("DELETE FROM blogs");		// delete existing (blog, pid) correspondence data

        foreach ($blogs as $bid){
        	$posts = $this->tumblr->getPosts($bid);
			$this->_insertPosts($posts);		// will insert any new posts (ignore existing ones)
			$this->_insertBlogs($bid, $posts);	// will repopulate the database with proper (bid, pid) correspondence
        }
    }

    public function updatePosts(){

		$result = $this->db->query("SELECT pid, blog_name FROM posts");
		$posts = array();
		$result->data_seek(0);

		while ($post = $result->fetch_assoc())
            $posts[] = $post;

        foreach ($posts as $post) {
        	$res = $this->tumblr->getPostbyBlogName($post['pid'], $post['blog_name']);
        	if ($res)
        		$this->_updatePostTrack($res);
        }
    }

    private function _updatePostTrack($post){

    	$query = "UPDATE posts SET last_count=".$post['last_count']." WHERE pid=".$post['pid'];
		$this->db->query($query);
		$query = "INSERT INTO tracks (pid, inc, count) VALUES";
		$value = "";
		$value .= $this->queries->insertTrackValues(
			$post['pid'],
			$post['last_count']);

		if ($value)
			$this->db->query(rtrim($query.$value, ","));
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
}

$tracker = new Tracker();
$tracker->updateBlogs();
$tracker->updatePosts();
echo date("F j, Y, g:i a")."\n";

?>

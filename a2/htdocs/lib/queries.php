<?php

class Queries{

	private $db = NULL;

	public function __construct(){
		$this->db = new Database();		// connect to the database
	}

	public function recentPosts($limit){
		$q = "SELECT tracks.pid, MAX(date) as odr, url, text, image, date, last_track, last_count 
				FROM tracks, posts WHERE posts.pid = tracks.pid 
				GROUP BY tracks.pid 
				ORDER BY MAX(date) DESC LIMIT ".$limit; 

		return $q;
	}

	public function trendingPosts($limit){
		$q = "SELECT tracks.pid, MAX(inc) as odr, url, text, image, date, last_track, last_count 
				FROM tracks, posts WHERE posts.pid = tracks.pid AND TIMESTAMPDIFF(MINUTE,time, CURRENT_TIMESTAMP) < 65
				GROUP BY tracks.pid 
				ORDER BY MAX(inc) DESC LIMIT ".$limit; 

		return $q;
	}

	public function recentPostsByBid($bid, $limit){
		$q = "SELECT tracks.pid, MAX(date) as odr, url, text, image, date, last_track, last_count 
				FROM tracks, posts, blogs 
				WHERE posts.pid = tracks.pid AND tracks.pid = blogs.pid AND blogs.bid = '".$bid."'
				GROUP BY tracks.pid 
				ORDER BY MAX(date) DESC"; 

		if ($limit)
			$q .= " LIMIT " . $limit;

		return $q.";";
	}

	public function trendingPostsByBid($bid, $limit){
		$q = "SELECT tracks.pid, MAX(inc) as odr, url, text, image, date, last_track, last_count 
				FROM tracks, posts, blogs 
				WHERE posts.pid = tracks.pid AND tracks.pid = blogs.pid AND blogs.bid = '".$bid."' AND TIMESTAMPDIFF(MINUTE,time, CURRENT_TIMESTAMP) < 65
				GROUP BY tracks.pid 
				ORDER BY MAX(inc) DESC"; 

		if ($limit)
			$q .= " LIMIT " . $limit;

		return $q.";";
	}

	public function tracksByPid($pid){
		return "SELECT time as timestamp, seq as sequence, inc as increment, count 
				FROM tracks 
				WHERE pid ='".$pid."' 
				ORDER BY seq DESC;";
	}

	public function insertPostValues($pid, $url, $text, $image, $date, $last_count, $blog_name){
		$v = " ('".$pid."', '".$url."', ";

		if (!$text) $v .= "null, ";
		else $v .= "'".$text."', ";

		if (!$image) $v .= "null, ";
		else $v .= "'".$image."', ";

		$v .= "'".$date."', ".$last_count.", '".$blog_name."'),";
		return $v;
	}

	public function insertBlogValues($bid, $pid){
		return " ('".$bid."', '".$pid."'),";
	}

	public function insertTrackValues($pid, $count){

		$q = "SELECT count, TIMESTAMPDIFF(MINUTE,time, CURRENT_TIMESTAMP) as last_time_diff 
				FROM tracks 
				WHERE pid = ".$pid." 
				ORDER BY time DESC 
				LIMIT 1";

		$result = $this->db->query($q);
		$inc = 0;
		if ($result->num_rows){
			$row = $result->fetch_assoc();
			$inc = $count-$row['count'];
			if ($row['last_time_diff'] < 55)
				return "";
		}

		return " ('" . $pid . "', '" . $inc  . "', ".$count."),";
	}
}

?>
<?php

class Tumblr{

	private $ch = NULL;
	private $api_key = "IrXhDhImvA7YszdkkNWMOERvSMtiDVIT8temPufrq6BaGazzyI";

	public function createPost($post){
		if (!isset($post->title))
			$post->title = str_replace("-"," ", $post->slug);
		if (isset($post->photos))
			$post->photos = $post->photos[0]->alt_sizes[0]->url;
		else
			$post->photos = 'http://i.imgur.com/jzxRoWR.png';
		return array(
			'pid' => $post->id,
			'url' => stripslashes($post->post_url),
			'text' => str_replace("'", "", $post->title),
			'image' => $post->photos,
			'date' => $post->date,
			'last_count' => (isset($post->note_count) ? (int) $post->note_count : 0),
			'blog_name' => $post->blog_name
			);
	}

	public function getPosts($bid){
		$url = "http://api.tumblr.com/v2/blog/".$bid."/likes?api_key=" . $this->api_key;
		$total = json_decode(file_get_contents($url))->response->liked_count;
		$offset = 0;
		$limit = 20;
		$posts = array();

		while ($offset <= $total){
			$newUrl = $url . "&offset=" . $offset;
			$result = json_decode(utf8_encode(file_get_contents($newUrl)));
			foreach ($result->response->liked_posts as $post)
				$posts []= $this->createPost($post);
			$offset += $limit;
		}
 		
 		return $posts;
	}

	public function getPostbyBlogName($pid, $blog_name){
		$url = "http://api.tumblr.com/v2/blog/".$blog_name.".tumblr.com/posts?api_key=". $this->api_key . "&id=" . $pid;
		$result = json_decode(utf8_encode(@file_get_contents($url)));
		if (!$result or $result->meta->status != 200)
			return false;	// pid doesn't exist
		return $this->createPost($result->response->posts[0]);
	}
}

?>

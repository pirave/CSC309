<?php

class Trends{

	private $db = NULL;
	private $queries = NULL;

	public function __construct(){
		$this->db = new Database();		// connect to the database
		$this->queries = new Queries();		// connect to the database

		$limit = null;
		if (isset($_GET['limit']))
			$limit = $_GET['limit'];

		if ($_GET['all'])
			$this->getTrends(strtolower($_GET['order']), $limit);
		else
			$this->getTrends(strtolower($_GET['order']), $limit, $_GET['id']);
	}

	public function getTrends($order, $limit, $bid=null){

		// default values if no paramters are given
		if (!$order) $order = 'trending';
		if (!$limit) $limit = 10;

		// if invalid parameters send error
		if ($order != 'trending' AND $order != 'recent' OR !is_numeric($limit)){
			new Response('invalid parameter', 404);
			return;
		}


		if ($bid){

			if ($order == 'trending')
				$query = $this->queries->trendingPostsByBid($bid, $limit);
			else
				$query = $this->queries->recentPostsByBid($bid, $limit);

		} else {

			if ($order == 'trending')
				$query = $this->queries->trendingPosts($limit);
			else
				$query = $this->queries->recentPosts($limit);

		}
			

		$result = $this->db->query($query);

		$trending = array();
		while ($row = $result->fetch_assoc()) {
			$tracking = array();

			$query = $this->queries->tracksByPid($row['pid']);
			$tracks = $this->db->query($query);
			while($track = $tracks->fetch_assoc())
				$tracking []= $track;

			$row['tracking'] = $tracking;
			unset($row['pid']);
			unset($row['odr']);
			$trending []= $row;
		}

		if ($trending){
			$res = array("trending"=>$trending, "order"=>$order, "limit"=>$limit);
			new Response(json_encode($res));
		} else
			new Response('blog not found', 404);
	}

}

?>
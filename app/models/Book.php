<?php

	class Book extends Eloquent{

		public $timestamps = false;  // Tell Laravel to not save timestamps in databse

		public function authors(){
			return $this->belongsToMany('Author');
		}

		public function users(){
			return $this->belongsToMany('User', 'owned_books');
		}
	}
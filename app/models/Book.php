<?php

	class Book extends Eloquent{

		public function authors(){
			$this->hbelongsToMany('Author');
		}

		public function users(){
			$this->belongsToMany('User', 'owned_books');
		}
	}
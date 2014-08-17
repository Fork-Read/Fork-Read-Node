<?php

	class Author extends Eloquent{

		public $timestamps = false;

		public function books(){
			return $this->belongsToMany('Book');
		}
	}
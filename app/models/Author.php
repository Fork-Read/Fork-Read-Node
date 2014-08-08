<?php

	class Author extends Eloquent{

		public function books(){
			$this->belongsToMany('Book');
		}
	}
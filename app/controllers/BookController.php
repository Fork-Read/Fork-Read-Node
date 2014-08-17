<?php

	class BookController extends BaseController {

		public function getUserBooks($user_id){

		}

		public function booksOwned(){
			
			return Input::all();

			$input = Input::all();

			$book_input = $input['book'];
			$author_input = $input['author'];
			$user_id = $input['user'];

			if(!$book_input || !$author_input || !$user_id){     // Return false if any of the values is not provided
				return "false";
			}

			$book = Book::whereIsbn($book_input['isbn'])->get();
			$author = Author::whereName($author_input['name'])->get();

			$user = User::whereId($user_id)->get();

			if($user->isEmpty()){		// If User doesn't exist then return false
				return "false";
			}

			$user = $user->first();

			if($author->isEmpty()){      // Check if the author is already present in the database
				$author = new Author;
				$author->name = $author_input['name'];
				$author->save();
			}

			if($book->isEmpty()){       // Check if the current book is already in the database
				$book = new Book;
				$book->title = $book_input['title'];
				$book->isbn = $book_input['isbn'];
				$book->category = $book_input['category'];
				$book->publisher = $book_input['publisher'];
				$book->published_date = $book_input['publishedDate'];
				$book->description = $book_input['description'];
				$book->thumbnail = $book_input['thumbnail'];
				$book->save();
				$book->authors()->save($author);
			}

			$book = $book->first();

			$book->users()->save($user);    // Save entry to owned book list

			return $book; 
			
		}
	}
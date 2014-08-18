<?php

	class BookController extends BaseController {

		public function getUserBooks($user_id){

		}

		public function booksOwned(){

			$input = Input::all();

			$book_array = $input['books_list'];
			$user_id = $input['user'];

			if(!$book_array || !$user_id){     // Return false if any of the values is not provided
				return "false";
			}


			$user = User::whereId($user_id)->get();

			if($user->isEmpty()) {		// If User doesn't exist then return false
				return "false";
			}
			else {
				$user = $user->first();
			}

			foreach($book_array as $item) {

				$book_item = $item['book'];
    			
				$book = Book::whereIsbn($book_item['isbn'])->get();

				if($book->isEmpty()){       // Check if the current book is already in the database
					$book = new Book;
					$book->title = $book_item['title'];
					$book->isbn = $book_item['isbn'];
					$book->category = $book_item['category'];
					$book->publisher = $book_item['publisher'];
					$book->published_date = $book_item['publishedDate'];
					$book->description = $book_item['description'];
					$book->thumbnail = $book_item['thumbnail'];
					$book->save();
				}
				else {
					$book = $book->first();
				}

				$author_array = $item['authors'];

				foreach($author_array as $i) {
    				$author = Author::whereName($i['name'])->get();

    				if($author->isEmpty()){      // Check if the author is already present in the database
						$author = new Author;
						$author->name = $i['name'];
						$author->save();
					}
					else {
						$author = $author->first();
					}
					$author->books()->save($book);
				}

				$book->users()->save($user);    // Save entry to owned book list
			}

			return "true"; 		
		}
	}
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooks extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('books', function($table){

			$table->increments('id');
			$table->string('title', 256);
			$table->string('isbn', 50);
			$table->string('category', 20);
			$table->string('publisher', 50);
			$table->string('published_date', 10);
			$table->text('description');
			$table->text('thumbnail');

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('books');
	}

}

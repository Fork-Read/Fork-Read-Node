<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('login');
});

Route::get('/login', function()
{
	return View::make('login');
});

Route::get('/signup', function()
{
	return View::make('signup');
});

Route::get('/login/facebook', 'LoginController@loginFacebook');

Route::get('/login/google', 'LoginController@loginGoogle');

Route::get('/hello', function(){
	return View::make('hello');
});

Route::group(array('prefix' => 'portal/api'), function()
{
	Route::get('/user/{user_id}', 'UserController@getUser');

	Route::post('/user/save', 'UserController@saveUser');

	Route::get('/isDuplicate/user/{email}', 'UserController@isDuplicate');

	Route::get('/own/books/{user_id}', 'BookController@getUserBooks');

	Route::post('/own/save', 'BookController@booksOwned');
});
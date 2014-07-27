<?php

class UserController extends BaseController {


	public function saveUser() {
		$input = Input::all();

		$user = new User;
		$user->name = $input['name'];
		$user->email = $input['email'];
		$user->contact_no = $input['contact_no'];
		$user->gender = $input['gender'];
		$user->current_location = $input['current_location'];
		$user->save();

		return $user;
	}

	public function getUser($email) {
		return User::whereEmail($email)->get();
	}
	
}

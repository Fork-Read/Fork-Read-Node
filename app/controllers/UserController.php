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

		if(User::whereEmail($input['email'])->get()->isEmpty()){
			$user->save();
		}
		return $user;
	}

	public function getUser($user_id) {
		return User::find($user_id);
	}
	
	public function isDuplicate($email) {
		$record = User::whereEmail($email)->get();
		
		return $record;   // returns blank object if no user found
	}
}

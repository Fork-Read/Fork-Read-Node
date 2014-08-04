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

	public function getUser($id) {
		return User::find($id);
	}
	
	public function isDuplicate($email) {
		$isEmpty = User::whereEmail($email)->get()->isEmpty();
		if($isEmpty){
			return 'false';   // If collection is empty then return false
		}
		else {
			return 'true';   // if collection is not empty then return true
		}
	}
}

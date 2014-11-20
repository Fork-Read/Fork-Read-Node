{{ Form::open(array('url' => '/portal/api/user/save')) }}

	{{ Form::text('name', null, 
		array('placeholder'=>'enter name')) }}

	{{ Form::email('email', null, 
		array('placeholder'=>'enter email'))}}

	{{ Form::text('contact_no', null, 
		array('placeholder'=>'enter number')) }}

	{{ Form::text('gender', null, 
		array('placeholder'=>'enter gender')) }}

	{{ Form::text('current_location', null, 
		array('placeholder'=>'enter location')) }}

	{{ Form::submit('Save') }}

{{ Form::close() }}
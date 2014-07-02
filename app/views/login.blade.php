<!Doctype html>
<html>
	<head>
		<title>Fork&Read</title>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300' rel='stylesheet' type='text/css'>
		{{ HTML::style('css/reset.css') }}
		{{ HTML::style('css/login.css') }}
	</head>
	<body>
		<div class="login-form-container">
			<input type="text" name="username" placeholder="enter email.." />
			<input type="password" name="password" placeholder="enter password.." />
			<button type="submit" class="btn login-button">Login</button>
			<button type="button" class="btn signup-button" onclick="location.href = '/signup';">Signup</button>
		</div>
	</body>
</html>
<!Doctype html>
<html>
	<head>
		<title>Fork&Read</title>
		<link href='http://fonts.googleapis.com/css?family=Indie+Flower' rel='stylesheet' type='text/css'>
		{{ HTML::style('css/reset.css') }}
		{{ HTML::style('css/login.css') }}
	</head>
	<body id="login">
		<div class="login-form-container">
			<input class="input-box" type="text" name="username" placeholder="enter email.." autofocus/>
			<input class="input-box" type="password" name="password" placeholder="enter password.." />
			<button type="submit" class="btn login-button">Login</button>
			<button type="button" class="btn signup-button" onclick="location.href = '/signup';">Signup</button>
		</div>

		<ul id="quotesSlideshow">
			<li>
				<p class="quote">
					There is more treasure in books than in all pirate's loot on Treasure Island.
				</p>
				<p class="said_by">
					-Walt Disney
				</p>
			</li>
			<li>
				<p class="quote">
					The book to read is not the one that thinks for you but the one which makes you think.
				</p>
				<p class="said_by">
					-Harper Lee
				</p>
			</li>
			<li>
				<p class="quote">
					A book is a gift you can open again and again.
				</p>
				<p class="said_by">
					-Garrison Keillor
				</p>
			</li>
			<li>
				<p class="quote">
					I love books. I love that moment when you open one and sink into it
					you can escape from the world, into a story that's way more interesting
					than yours will ever be.
				</p>
				<p class="said_by">
					-Elizabet Scott
				</p>
			</li>
			<li>
				<p class="quote">
					The reading of all good books is like conversation with the finest men of past centuries.
				</p>
				<p class="said_by">
					-Descartes
				</p>
			</li>
			<li>
				<p class="quote">
					You can find magic wherever you look. Sit back and relax, all you need is a book.
				</p>
				<p class="said_by">
					-Dr Seuss
				</p>
			</li>
		</ul>

		<footer>
			<ul class="footerMenu">
				<li>
					<a href="#">about us</a>
				</li>
				<li>
					<a href="#">contact us</a>
				</li>
				<li>
					<a href="#">Copyright &copy; 2014 Fork&Read</a>
				</li>
				<li>
					<a href="#">blog</a>
				</li>
				<li>
					<a href="#">privacy</a>
				</li>
			</ul>
		</footer>
		{{ HTML::script('js/jquery-1.11.1.min.js') }}
		{{ HTML::script('js/ticker.js') }}
		{{ HTML::script('js/login.js') }}
	</body>
</html>
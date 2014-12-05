(function(){

	$(document).ready(function(){

		$('input[name="email"]').val('');

		$('button.count-me-in').on('click', function(){

			var email = $.trim($('input[name="email"]').val());

			if(!email.length){
				$('.error').html('Please enter a email address.').show();

				setTimeout(function(){
					$('.error').fadeOut();
				}, 2000);

				return;
			}

			var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
			if(!pattern.test(email)){
				$('.error').html('Please enter a valid email address.').show();

				setTimeout(function(){
					$('.error').fadeOut();
				}, 2000);
				return;
			}

			$.ajax({
				url: '/subscribe/' + email,
			  	type: 'GEt',
			  	success: function(data) {
			  		if(data.isAdded){
			  			$('.success').show();

						setTimeout(function(){
							$('.success').fadeOut();
						}, 3000);

						$('input[name="email"]').val('');
			  		}
			  		else{
			  			$('.error').html('Sorry! We were unable to add your email.').show();

						setTimeout(function(){
							$('.error').fadeOut();
						}, 2000);
			  		}
			  	}
			});
		});
	});

})();
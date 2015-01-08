(function(){

	$(document).ready(function(){

		$('.item-delete').on('click', function(e){
			var id = $(this).attr('data-user');
			$.ajax({
				url: '/admin/user/changeStatus',
				type: 'POST',
				data: JSON.stringify({user: id, isActive: false}),
				contentType: 'application/json',
				success: function(status){
					if(status.hasChanged){
						$(e.target).closest('.user-item').remove();
					}
					else{
						alert('not deleted');
						// Show Alert
					}
				}
			});
		});

		$('.item-activate').on('click', function(e){
			var id = $(this).attr('data-user');
			$.ajax({
				url: '/admin/user/changeStatus',
				type: 'POST',
				data: JSON.stringify({user: id, isActive: true}),
				contentType: 'application/json',
				success: function(status){
					if(status.hasChanged){
						$(e.target).closest('.user-item').remove();
					}
					else{
						alert('not deleted');
						// Show Alert
					}
				}
			});
		});
	});
})()
<?php 

return array( 
	
	/*
	|--------------------------------------------------------------------------
	| oAuth Config
	|--------------------------------------------------------------------------
	*/

	/**
	 * Storage
	 */
	'storage' => 'Session', 

	/**
	 * Consumers
	 */
	'consumers' => array(

		/**
		 * Facebook
		 */
        'Facebook' => array(
            'client_id'     => '271825102996688',
            'client_secret' => 'aac6989dde44d88feaae39325e02c923',
            'scope'         => array('email','read_friendlists','user_online_presence'),
        ),

        'Google' => array(
    		'client_id'     => '126918718154-62q26f4j0kbta2pvo9f5gir4ojj1qa9g.apps.googleusercontent.com',
    		'client_secret' => 'dGIiMBvDgDlTnShaSzD9QsB9',
    		'scope'         => array('userinfo_email', 'userinfo_profile'),
		),  

	)

);
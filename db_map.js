User
	- name
	- email
	- number
	- location
			- position
					- latitude
					- longitude
			- address
				- locality
				- city
				- state
				- country
	- active
	- role
	- access_token
	- verified
	- created_at
	- updates_at
	- salt


Book
	- title
	- isbn (Array)
	- authors (Array)
	- published_by
	- language
	- image
	- preview_link (google web preview link)
	- description
	- genre (Array)
	- page_count
	- google_rank
	- published_at


Locations (User's pickup and drop locations)
	- user_id
	- latitude
	- longitude
	- house
	- street
	- city
	- state
	- country
	- zipcode


Genres
	- name


User Book Relation
	- user_id
	- book_id
	- in_read
	- in_wishlist
	- in_like


User Book Own
	- user_id
	- book_id
	- for_sale
	- cost_price
	- msp (max selling price)
	- selling_price
	- book_condition (If available for sale)


Book Requests
	- user_id
	- book_id
	- tarrif
	- start_date
	- end_date
	- is_completed
	- is_cancelled
	- reason
	- is_approved
	- vendor_id


Book Rented
	- user_id
	- book_id
	- tarrif
	- cost
	- start_date
	- end_date
	- has_extended (Id user extends the renting period)
	- comments
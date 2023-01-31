Feature: GetUserByEmail


This feature is used to get a user by email from the database given the email that is input

This is an integration test

@tag1
Scenario: Getting a user by email with valid data
	Given The email is
	| Email					|
	| sarah@gmail.com	    | 
	And The user to be retrieved is
	| Email                 | Username    | Password | Role |
	| sarah@gmail.com		| Sarah       | password | role |
	When The user is retrieved by email
	Then The user returned should be correct

@tag2
Scenario: Getting a user by email with invalid data
	Given The email is
	| Email					  |
	| michalguzym@gmail.com23 |  
	And The user to be retrieved is
	| Email                 | Username    | Password | Role  |
	| blank	 				| blank		  |	blank    | blank | 
	When The user is retrieved by email
	Then The user returned should be correct
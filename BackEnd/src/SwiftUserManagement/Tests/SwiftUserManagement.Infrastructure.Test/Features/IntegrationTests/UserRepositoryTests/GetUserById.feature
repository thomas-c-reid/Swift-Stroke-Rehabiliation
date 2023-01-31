Feature: GetUserById

This feature is used to get a user by id from the database given the id that is input

This is an integration test

@tag1
Scenario: Getting a user by email with valid data
	Given The id is
	| id					|
	| 2					    | 
	And The user to be retrieved is
	| Email                 | Username    | Password | Role |
	| sophie@gmail.com		| Sophie Young| password | role |
	When The user is retrieved by id
	Then The user returned should be correct

@tag2
Scenario: Getting a user by email with invalid data
	Given The id is
	| id     |
	| 25	 |  
	And The user to be retrieved is
	| Email                 | Username    | Password | Role  |
	| blank	 				| blank		  |	blank    | blank | 
	When The user is retrieved by id
	Then The user returned should be correct
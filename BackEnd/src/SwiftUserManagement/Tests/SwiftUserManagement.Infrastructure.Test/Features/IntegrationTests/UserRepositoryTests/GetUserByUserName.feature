Feature: GetUserByUserName

This feature is used to get a user by username from the database given the username that is input

This is an integration test


@tag1
Scenario: Getting a user by username with valid data
	Given The username is
	| Username    |
	| Sophie Young| 
	And The user to be retrieved is
	| Email                 | Username    | Password | Role |
	| sophie@gmail.com      | Sophie Young| password | role |
	When The user is retrieved
	Then The user returned should be correct

@tag2
Scenario: Getting a user by username with invalid data
	Given The username is
	| Username		 |
	| Michal Guzy123 | 
	And The user to be retrieved is
	| Email                 | Username    | Password | Role  |
	| blank	 				| blank		  |	blank    | blank | 
	When The user is retrieved
	Then The user returned should be correct
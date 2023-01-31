Feature: UpdateUserPassword

This feature is used to update a user's password in the database on the Id

This is an integration test


@tag2
Scenario: Updating a user with valid data
	Given The id is
	| Id					|
	| 2 					| 
	When The password is updated
	| Password |
	| password |
	Then The return should be true

@tag3
Scenario: Updating a user with invalid data
	Given The id is
	| Id					|
	| 25 					| 
	When The password is updated
	| Password |
	| password |
	Then The return should be false
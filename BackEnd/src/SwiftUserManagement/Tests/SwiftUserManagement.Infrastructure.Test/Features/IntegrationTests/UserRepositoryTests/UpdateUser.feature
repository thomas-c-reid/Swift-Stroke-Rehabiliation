Feature: UpdateUser

This feature is used to update a user in the database on the Id

This is an integration test


@tag2
Scenario: Updating a user with valid data
	Given The id is
	| Id					|
	| 1						| 
	When The user is updated
	| Email                 | Username    | Password | Role |
	| sophie@gmail.com		| Sophie      | password | User |
	Then The return should be true

@tag3
Scenario: Updating a user with invalid data
	Given The id is
	| Id						|
	| 25						| 
	When The user is updated
	| Email                 | Username    | Password | Role |
	| sophie@gmail.com		| Sophie      | password | User |
	Then The return should be false
Feature: CreateUser

This feature is used to create a user in the database given the parameters that are input
This test doesn't have any invalid data as it's the application side of the system's job to check for data validation.

This is an integration test

@tag1
Scenario: Creating a user with valid data
	Given The user to be added to the database is valid
	| Email                 | Username    | Password | Role |
	| michalguzym@gmail.com | Michal Guzy | password | role |
	When The user is created
	Then The return should be true


@tag1
Scenario: Creating another user with valid data
	Given The user to be added to the database is valid
	| Email                 | Username    | Password | Role |
	| sophie@gmail.com		| Sophie      | password | role |
	When The user is created
	Then The return should be true
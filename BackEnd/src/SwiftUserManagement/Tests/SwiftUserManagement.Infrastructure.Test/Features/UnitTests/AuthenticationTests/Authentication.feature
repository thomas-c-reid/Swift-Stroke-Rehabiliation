Feature: Authentication

The user should be able to authenticate to allow access to all of the endpoints.

This is a unit test.

@tag1
Scenario: Authenticate a valid user
	Given The user is valid 
	| Email                 | Password |
	| michalguzym@gmail.com | password |
	When The user authenticates
	Then The user should receive a JWT token

@tag2
Scenario: Authenticate an invalid password
	Given The user's password is invalid
	| Email                 | Password      |
	| michalguzym@gmail.com | WrongPassword |
	When The user authenticates
	Then The user should be unauthorized

@tag3
Scenario: Authenticate an invalid Email
	Given The user's email is invalid
	| Email            | Password      |
	| michal@gmail.com | password	   |
	When The user authenticates
	Then The user should be unauthorized
	


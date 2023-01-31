Feature: CreateUser

Creating a user

@tag1
Scenario: Create user
	Given The database is up and runnin
	When I hit the create user endpoint
	Then The user will be created

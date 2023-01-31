Feature: CheckIfPasswordMatches

This feature is used to check if a users password matches the one stored in the database

This is an integration test


@tag1
Scenario: Checking a password with valid data
	Given The user to be checked is valid
	| Email                 | Username    | Password													 | Role |
	| sophie@gmail.com	    | Sophie Young| $2a$12$BFN3V/Rt6tSsO3Lpz4ue8O.Bg.Jb5dA7l08/LPBn./PpSiRQPO16a | role |
	Given The username to check is
	| Username     |
	| Sophie Young |
	Given the password to check is
	| Password |
	| password |
	When The password is checked
	Then The return should be true

@tag1
Scenario: Checking a password with invalid data
	Given The user to be checked is valid
	| Email                 | Username    | Password													 | Role |
	| sophie@gmail.com	    | Sophie Young| $2a$12$BFN3V/Rt6tSsO3Lpz4ue8O.Bg.Jb5dA7l08/LPBn./PpSiRQPO16a | role |
	Given The username to check is
	| Username     |
	| Sophie Young |
	Given the password to check is
	| Password     |
	| password1234 |
	When The password is checked
	Then The return should be false
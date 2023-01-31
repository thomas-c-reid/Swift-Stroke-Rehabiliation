Feature: RetrieveGameData

This feature is used to retrieve a users game scores from the database given their id

This is an integration test

@tag1
Scenario: Retrieving a valid users game data
	Given The id is
	| id					|
	| 1					    | 
	When The users results are retrieved
	Then The list should have data

@tag2
Scenario: Retrieving an invalid users game data
	Given The id is
	| id     |
	| 25	 |  
	When The users results are retrieved
	Then The list should not have data

@tag2
Scenario: Retrieving an valid users game data but they have no results
	Given The id is
	| id     |
	| 2 	 |  
	When The users results are retrieved
	Then The list should not have data

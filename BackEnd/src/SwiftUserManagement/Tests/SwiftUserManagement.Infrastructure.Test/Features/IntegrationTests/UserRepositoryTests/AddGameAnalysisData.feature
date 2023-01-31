Feature: AddGameAnalysisData

Adding game analysis data for a user into the database

This is an integration test

@tag1
Scenario: Uploading valid game data
	Given The game data is
	| Accuracy | timeTaken | difficulty | id |
	| 100      | 90        | 90         | 1  |
	When The game data is added to the database
	Then The return should be true
	
@tag2
Scenario: Uploading invalid game data with invalid id
	Given The game data is
	| Accuracy | timeTaken | difficulty | id  |
	| 100      | 90        | 90         | 25  |
	When The game data is added to the database
	Then The return should be false

@tag3
Scenario: Uploading invalid game data with difficulty below 0
	Given The game data is
	| Accuracy | timeTaken | difficulty | id  |
	| 100      | 90        | -29        | 1   |
	When The game data is added to the database
	Then The return should be false

@tagr
Scenario: Uploading invalid game data with difficulty above 100
	Given The game data is
	| Accuracy | timeTaken | difficulty | id  |
	| 100      | 90        | 121        | 1   |
	When The game data is added to the database
	Then The return should be false
Feature: EmitCalculateGameDifficultyRabbitMQ

The C# API sends data via RabbitMQ over to the Python Difficulty generator code so that the difficulty can be calculated
and the user can receive their new difficulty.

This is an integration test

@tag1
Scenario: Emitting valid data to calculate the new difficulty to RabbitMQ container instance	
	Given The results to be sent through are valid
	| accuracy | timeTaken | level |
	| 25       | 50        | 1     |
	When The emit difficulty function is called
	Then The result from this method call should be true

@tag2
Scenario: Emitting invalid data to calculate the new difficulty to RabbitMQ container instance	
	Given The results to be sent through are invalid
	| accuracy | timeTaken | level |
	| 0        | 0         | -5    |
	When The emit difficulty function is called
	Then The result from this method call should be false

@tag3
Scenario: The hostname is wrong so the application can't connect to RabbitMQ
	Given The results to be sent through are valid
	| accuracy | timeTaken | level |
	| 25       | 50        | 1     |
	When The emit difficulty function is called with the wrong hostname
	Then the result from this method call should return a connection error
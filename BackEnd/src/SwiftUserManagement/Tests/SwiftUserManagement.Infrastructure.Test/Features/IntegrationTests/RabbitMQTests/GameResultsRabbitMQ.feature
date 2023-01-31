Feature: GameResultsRabbitMQ

The C# API sends data via RabbitMQ over to the Python results service so that the game results can be analysed
and the user can see this data on graphs in the front end.

@tag1
Scenario: Emitting the game results to the RabbitMQ container instance
	Given The results to be sent through are valid
	| accuracy | timeTaken | level |
	| 25       | 50        | 1     |
	When The emit game results rabbitmq function is called
	Then The result from this method call should be true

@tag2
Scenario: Emitting invalid game analysis data to the RabbitMQ container instance
	Given The results to be sent through are invalid
	| accuracy | timeTaken | level |
	| 0        | 0         | -5    |
	When The emit game results rabbitmq function is called
	Then The result from this method call should be false

@tag3
Scenario: The hostname is wrong so the application can't connect to RabbitMQ
	Given The results to be sent through are valid
	| accuracy | timeTaken | level |
	| 25       | 50        | 1     |
	When The emit game results rabbitmq function is called with the wrong host
	Then the result from this method call should return a connection error
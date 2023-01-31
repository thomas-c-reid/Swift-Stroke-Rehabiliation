Feature: EmitVideoAnalysisRabbitMQ

The C# API sends data via RabbitMQ over to the Python AI Analysis code so that the video results can be analysed
and the user can see if there has been a chance of stroke.

This is an integration test

@tag1
Scenario: Emitting video analysis to the RabbitMQ container instance	
	Given The video analysis results to be sent through are valid
	When The emit video analysis function is called
	Then The result from the emit video analysis should be true

@tag2
Scenario: Emitting invalid video analysis data to the RabbitMQ container instance
	Given The video analysis results to be sent through are invalid
	When The emit video analysis function is called
	Then The result from the emit video analysis method call should be false

@tag3
Scenario: The hostname is wrong so the application can't connect to RabbitMQ
	Given The video analysis results to be sent through are valid
	When The emit video analysis function is called with the wrong hostname
	Then The result from the emit video analysis method call should be false
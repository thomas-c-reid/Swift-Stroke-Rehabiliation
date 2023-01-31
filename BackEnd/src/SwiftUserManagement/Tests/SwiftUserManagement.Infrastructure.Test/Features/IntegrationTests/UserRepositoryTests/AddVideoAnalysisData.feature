Feature: AddVideoAnalysisData

Adding video analysis data for a user into the database

This is an integration test

@tag1
Scenario: Uploading valid video analysis
	Given The video analysis data is
	| VideoName | UserId | WeaknessPrediction |
	| video.mp4 | 1      | No weakness        |
	When The video analysis data is added to the database
	Then The return should be true
	
@tag1
Scenario: Uploading invalid video analysis
	Given The video analysis data is
	| VideoName | UserId | WeaknessPrediction |
	| video.mp4 | 25     | No weakness        |
	When The video analysis data is added to the database
	Then The return should be false
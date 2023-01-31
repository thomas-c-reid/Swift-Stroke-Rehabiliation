# SWIFT Rehab Application

## Project vision

The Swift mobile application aims to be a rehabilitation tool to monitor a user’s progress in hand-eye-coordination
through gamified examinations. The intended beneficiaries of this product are those who have previously had a stroke
and are in the process of rehabilitation. Scores received from the assessments will allow a user to track their progress
over time, which can be relayed to their medical professional for further analysis. The strength of our proposed solution
compared to existing systems is the ability to assess multiple weakness points within a singular application. The product
vision has been adapted since the previous submission, as focus has been shifted from hand and arm pronation tests to
prioritising rehabilitation through hand-eye-coordination games

## Assumptions

This tool is a proof of concept. In order for it to be successful, we need to make assumptions that are fair both in terms of the solution and the user. 

1. User must have an (Android/IOS + version) smartphone with internet access: According to a study conducted in 2020, 84% of UK adults (16+) own a smartphone. According to the Office of National Statistics, 87% of all adults in the UK used the internet daily or almost every day in 2019.

...

## User Stories (this might help us define the requirements)

1. Domestic User To be able to use the Swift application on my Android device
2. Domestic User To be able to use the Swift application on my iOS device
3. Domestic User A way to register for a Swift account using my Google account
4. Domestic User A way to register for a Swift account using my preferred email
5. Domestic User A way to register for a Swift account using Facebook
6. Domestic User A way to login to the system with my pre-existing account
7. Domestic User A way to navigate through the app that is not overly complicated
8. Domestic User To be able to play the coordination game every day
9. Domestic User The coordination game to be simple as my hand-eye coordination skills
   are very limited
10. Domestic User The coordination game to be different every day so that it does not get
    repetitive
11. Domestic User To be able to see my score once I finish the coordination game
12. Domestic User To be able to view my results from the coordination game over a period
    of time
13. Domestic User To be able to receive feedback on my game results
14. Domestic User To be able to share my progress history with my doctor
15. Domestic User To be able to change the colour palette of the app to be in line with my
    colour blindness
16. Domestic User To be able to view all text, buttons and images clearly, even with a visual 
    impairment
17. Domestic User For my sensitive information to be secure and not exposed
18. Domestic User To be able to easily log out of the app whenever I am finished
19. Medical Professional To be able to view a patients results from the coordination game over a
    period of time



## Functional Requirements (What the system must do)
1. Provide the user with a functional GUI that should present different
   buttons and text to guide them. 
2. Present the user with options to register via Google, Facebook or Swift 
3. Store user credentials in the database 
4. Present the user with the ability to log in to the application using an
   already registered email address and password, either through Google, Facebook or Swift
5. Allow the user to log out of the application and delete the authentication token 
6. Present the user with an interactive game to test their hand-eye coordination 
7. Generate a score for the user upon completion of the coordination
   game based on the data collected from their interactions 
8. Send user game results to the server where they can be saved in the
   database 
9. Allow the user to track their progress in hand-eye coordination by
   viewing previous scores 



...

## Non-functional Requirements (Properties that improve the experience)

1. Allow the user to easily navigate through the application to any of
   the screens. Screens should have a consistent layout, with buttons for
   home, help and settings appearing in the same position on all screens.
2. Give the user the ability to change the main colour palette of the
   whole application to one of several options to accommodate those with
   colour-blindness.
3. Ensure font size and buttons are large and easily readable for those
   with visual impairments.
4. Ensure the application is able to run on both the iOS and Android
   operating systems.
5. Store user credentials securely by hashing their passwords.
6. Protect the database against attacks such as SQL Injection.
7. Provide data validation on user login details to ensure credentials are
   legitimate.
8. Encrypt the database keys automatically to provide additional protection.
9. Make use of JSON web tokens when receiving data that has been sent from the web server to the application for additional security.
10. Generate random obstacle layouts for each level of the game.
11. Provide the user with different levels of difficulty throughout the game.
12. Provide on screen guidance to direct the user on how to play the game. This would be in the form of an interactive tutorial that        overlays the game screen. It would provide the user with the opportunity to carry out a “practice run” of the game before playing.
13. Display results to the user in a format that is easy to understand with
    justification by including all parameters used to calculate the score.
14. Secure communications between the front end and server. 
15. View previous scores via a “View Results” screen with options of a
    calendar view and weekly and monthly progress charts.




...

## System Architecture - Front end, middle, back end

FYI from wiki - A system architecture is the conceptual model that defines the structure, behavior, and more views of a system. An architecture description is a formal description and representation of a system, organized in a way that supports reasoning about the structures and behaviors of the system. A system architecture can consist of system components and the sub-systems developed, that will work together to implement the overall system. There have been efforts to formalize languages to describe system architecture, collectively these are called architecture description languages (ADLs).

It includes three main components that have been improved and are to be developed further in Semester Two: the front-end mobile application
(linked to requirement 1.0), the Flask server (Linked to requirement 5.0) and the PostgreSQL database (linked to re-
quirement 3.0). At a higher level, the mobile application has been created using React Native, ensuring it can run on
both Android and iOS platforms. There is an HTTPS connection between the Google OAuth2 API and the front end,
allowing users to be authenticated using a Google login, without having to remember a username and password
(linked to requirement 2.0). There is a further entry point for the system that was implemented by an administrator
in the last year of the project, however this has been turned off as it is incomplete and is not a major focus of the
3
project. This administrator web interface would allow for the retrieving of data from the examination results. The admin
could then analyse this data and make choices regarding whether the artificial intelligence algorithms need to be updated.
The user can log in using the Swift Login, or they can log in using Google Authentication. With both login methods, the user will receive a JSON Web Token for any subsequent requests (token generation is explained in section 2.2.3). The database is currently a PostgreSQL database as this was implemented by the previous team, however any database supported by SQLAlchemy can be successfully connected to
the Flask server. The database key will be stored in an encrypted file for security; these keys allow the server to connect
to the database via TCP/IP

## Please note

Please note that the strength assessment currently works on the back end and can be tested through swagger. The front end also records a video and saves it onto the phone locally, however sending the video over to the back end does not work as the front end throws an exception when doing so.

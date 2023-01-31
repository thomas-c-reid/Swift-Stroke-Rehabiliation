# Front End of the Swift App

###Requirements:

- Node.js install (version 14+) https://nodejs.org/en/download/

##Getting the Swift app running:
The app uses the library EXPO to run, you will need an emulator
or physical device (Android or iOS) to interact with the app.

1. Navigate to `/FrontEnd` folder
2. Run `yarn install` in the terminal. This installs expo and all of the dependencies it needs
3. Type the command `expo start` to the terminal
4. You should see a console output with a QR code shown
5. The app should now be running

##Running an Emulator: iPhone/iOS

1. Install XCode from the App Store
2. In the terminal, run 'expo start --ios'
3. A virtual iPhone should appear and the Swift app should load
4. May need to refresh using the 'r' command in the terminal

##Running an Emulator: Android

1. Open up Android Studio
2. In the 'Welcome' window click `Configure -> AVD manager`
3. Create a virtual device if you do not have one
4. Click the play button in actions to launch emulator
5. In the terminal, run 'expo start', and then type the letter 'a' in the console

##Running the App on a Physical Phone (works with Android and iOS)

1. Download Expo Go from the app/Play Store
2. Run 'expo start' in the terminal - this should produce a QR code
3. Scan this QR code with the smartphone's camera, and it should open to Expo and run the Swift app
   Alternatively, open the developer console in a web browser and click "tunnel', then scan the QR code provided and it should open on the smartphone

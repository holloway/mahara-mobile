# Mahara Mobile

A Mahara app for offline use.

The technology is JavaScript ES6, React, Redux, and Phonegap.

## Smartphone Install

App packages will be available at a later date.

## Dev Install

Download this repository and then run,

    npm install
    npm run init

This will install the cordova dependencies and platforms specified in the config.xml file. Next build the application,

    npm run build

This bundles up the Javascript source code in the `./src` directory and outputs it into the `./www/` directory. The `./www/` output directory will be a static website, intended to be packaged as a Phonegap project.

For basic debugging you can serve this directory up from a static file webserver:

   npm run devwebserver

This command will also launch the Chromium browser with the "--disable-web-security" and "--user-data-dir" flags. (This is necessary to avoid CORS restrictions that would otherwise apply for a web application running in a web browser.)

Note: Phonegap plugins aren't available in the browser and so feature using these won't be available.

### Android Build

To build the Android app, first install dependencies (Ubuntu 16.04):

    sudo add-apt-repository -y ppa:webupd8team/java
    sudo add-apt-repository ppa:paolorotolo/android-studio
    sudo apt-get update
    sudo apt-get install oracle-java7-installer oracle-java7-set-default

Then download and install Android studio from https://developer.android.com/studio/index.html

Launch Android Studio and run through the first-time wizard. Then from the tools menu, launch the SDK Manager. Install:

    Android SDK Tools
    Android SDK Platform-tools
    Android 6.0 -> SDK Platform
    Android 6.0 -> Intel x86 Atom_64 System Image

Once those are installed, close the SDK Manager and launch the AVD Manager. Create an Android 6 (API 23) virtual device, and launch it. (Or alternately, you could connect up a physical Android device via USB, and put it in development mode.)

Then finally, run:

    npm run cordova-run-android

## Troubleshooting

#### Running `cordova run android` doesn't start the app on Android 4.x

It might be caused by http://stackoverflow.com/a/30240520

# TODO

## Server

The app currently scrapes details out of a Mahara Server instance which obviously isn't ideal.

So this is a list of Mobile APIs that we need,

* Deprecate/discard tokens, just use sessions like regular users
* Login
* Login types available (local user, SSO)
* SSO URL
* Current login state
* Mobile token error should have machine-readable error code
* Set mobile token
* Session duration/timeout
* Get current username from session

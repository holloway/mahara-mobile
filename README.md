# Mahara Mobile

A Mahara app for offline use.

The technology is JavaScript ES6, React, Redux, and Phonegap.

## Smartphone Install

App packages will be available at a later date.

## Dev Install

Download this repository and then run,

    npm install

Next build the application,

    npm run build

The `./www/` output directory will be a static website, intended to be packaged as a Phonegap project.

For basic debug you can serve this directory up from a static file webserver,

   npm run devwebserver

Note: Phonegap plugins aren't available in the browser and so feature using these won't be available.

### Android Build

To wrap as a Phonegap project, then run

    npm run cordova-init

Then for Android first install dependencies (Ubuntu 16.04),

    sudo add-apt-repository -y ppa:webupd8team/java
    sudo add-apt-repository ppa:paolorotolo/android-studio
    sudo apt-get update
    sudo apt-get install oracle-java7-installer oracle-java7-set-default
    apt-get install android-sdk android-emulator android-studio

Next run,

    /opt/android-studio/bin/studio.sh

Click through the wizard, then,

    npm run cordova-init-android1
    npm run cordova-init-android2

Then see if it's all working by,

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

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

And then use the `./www/` output directory as a Phonegap project (`cordova run android`), or run,

    npm run devwebserver

...to use it in your browser. Note that as certain plugins aren't available some features are disabled for browser use.

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
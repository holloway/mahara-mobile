import React, { PropTypes }   from 'react';
import MaharaBaseComponent    from '../base.js';
import {PAGE_URL,
    FILE_ENTRY}               from '../../constants.js';
import Router                 from '../../router.js';
import StateStore             from '../../state.js';
import fs                     from '../../mahara-lib/files-lib.js';

class Add extends MaharaBaseComponent {
    constructor() {
        super();

        this.renderTakePhoto = this.renderTakePhoto.bind(this);
        this.renderUpload = this.renderUpload.bind(this);
        this.uploadFileChange = this.uploadFileChange.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
    }

    render() {
        return <section>
            <h1>{this.gettext('add_new')}</h1>
            {this.renderUpload() }
            <button onClick={this.addJournalEntry} className="big">{this.gettext('add_journal_entry') }</button>
        </section>;
    }

    renderTakePhoto() {
        if (window.isCordova === false) return "";
        return <button onClick={this.takePhoto} className="big">{this.gettext('camera_take_photo_button') }</button>;
    }

    renderUpload() {
        if (!isFileInputSupported) return "";

        var inputId = "fileUpload" + (this.props.pendingUploads ? this.props.pendingUploads.length : 0);
        return <span>
            <input type="file" id={inputId} onChange={this.uploadFileChange} ref="fileUpload"/>
            <label htmlFor={inputId} className="big">{this.gettext('upload_file') }</label>
        </span>;
    }

    uploadFileChange(e) {
        var fileUploadElement = this.refs.fileUpload;

        if (!fileUploadElement || !fileUploadElement.files || fileUploadElement.files.length === 0) return;

        this.handleInputAsDataUrl(fileUploadElement);
        //this.handleInputAsFileInputs(fileUploadElement);

        Router.navigate(PAGE_URL.PENDING);
    }

    handleInputAsDataUrl = (fileUploadElement) => {
        // DataURLs are like base64 so they waste bytes
        // and need processing to be used, and are inefficient
        // at large sizes, but they can be preserved in localStorage.
        // More here https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs

        var that = this,
            reader,
            i;

        var fileObj, guid;
        for (i = 0; i < fileUploadElement.files.length; i++) {
            fileObj = fileUploadElement.files[i];
            guid = this.guidGenerator();
            // Read the file in, and write it into a temp file
            // TODO: Clear out those temp files from time to time!
            fs.readFileAsArrayBuffer(
                fileObj,
                function fileReadWin(data) {
                    var fileExtension = fileObj.name.substr(fileObj.name.lastIndexOf('.'));
                    var tempFileName = 'tmpfileupload' + guid + fileExtension;

                    fs.getFileAndWriteInIt(
                        tempFileName,
                        data,
                        function tempFileWriteWin(tempFileUrl) {
                            StateStore.dispatch(
                                {
                                    type: FILE_ENTRY.ADD_ENTRY,
                                    fileEntry: {
                                        type: FILE_ENTRY.TYPE,
                                        title: fileObj.name,
                                        description: null,
                                        tags: [],
                                        fileUrl: tempFileUrl,
                                        guid: guid,
                                        fileName: fileObj.name,
                                        mimeType: fileObj.type || "image/jpeg",
                                        createdOn: Date.now()
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
    }

    uriToFilename(uri) {
        return (uri.indexOf("/") === -1) ? uri : uri.substring(uri.lastIndexOf("/") + 1);
    }

    takePhoto = (e) => {
        if (!navigator.camera || !navigator.camera.getPicture || !navigator.camera.DestinationType) {
            alertify.okBtn(this.gettext('alert_ok_button'));
            alertify.alert(this.gettext('camera_unavailable'));
            return;
        }
        navigator.camera.getPicture(
            this.cameraSuccess,
            this.cameraError,
            { destinationType: navigator.camera.DestinationType.FILE_URI });
    }

    cameraSuccess = (imageUri) => {
        var fileName = this.uriToFilename(imageUri),
            fileEntry = {
                type: FILE_ENTRY.TYPE,
                title: fileName,
                guid: this.guidGenerator(),
                uri: imageUri,
                mimeType: "image/jpeg",
                fileName: fileName,
                createdOn: Date.now()
            };

        StateStore.dispatch({ type: FILE_ENTRY.ADD_ENTRY, fileEntry: fileEntry });
        Router.navigate(PAGE_URL.PENDING);
    }

    cameraError = (message) => {
        alertify
            .okBtn(this.gettext("alert_ok_button"))
            .alert(this.gettext("camera_error") + " " + message);
    }

    guidGenerator() {
        return (Math.random() + 1).toString(36).substring(2, 12) + (Math.random() + 1).toString(36).substring(2, 12);
    }

    addJournalEntry = (e) => {
        Router.navigate(PAGE_URL.ADD_JOURNAL_ENTRY);
    }
}

var isFileInputSupported = (function () {
    // Handle devices which falsely report support
    if (navigator.userAgent && navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    // Create test element
    var el = document.createElement("input");
    el.type = "file";
    return !el.disabled;
})();

export default Add;

Add.propTypes = {
  pendingUploads: PropTypes.array.isRequired
};

/*
html5Camera = (e) => {
  //TODO: Make this work as a browser fallback, or perhaps just have a file upload?

  var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      video = document.createElement("video"),
      videoObj = {"video": true},
      errBack = function(error) {
        console.log("Video capture error: ", error.code, error);
      };

  if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
}

 */

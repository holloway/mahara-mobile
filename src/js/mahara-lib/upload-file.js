import httpLib               from './http-lib.js';
import {dataURItoBlob,
    trimString}          from './util.js';
import http                  from './http-lib.js';

const wsfunction = 'module_mobileapi_upload_file';

const UPLOAD_HANDLER_TYPE = {
    PHONEGAP_UPLOADER: "UPLOAD_HANDLER_PHONEGAP",
    XHR_UPLOADER: "UPLOAD_HANDLER_XHR"
};


export default function uploadFile(fileEntry, successCallback, errorCallback) {
    if (!this.getWwwroot() || !this.getWSToken()) {
        return errorCallback({
            error: true,
            message: "You have not yet connected to a Mahara instance.",
            fileEntry: fileEntry
        });
    }

    if (!this.getTargetFolderName()){
        return errorCallback({
            error: true,
            message: "No folder configured as upload target.",
            fileEntry: fileEntry
        });
    }

    httpLib.callWebservice(
        wsfunction,
        {
            foldername: this.getTargetFolderName(),
            title: fileEntry.fileName
        },
        function winFn(responsejson) {
            successCallback(
                {
                    fileEntry: fileEntry,
                    response: responsejson
                }
            );
        },
        function failFn(response) {
            if (!response) response = {error:true};
            response.fileEntry = fileEntry;
            errorCallback(response);
        },
        fileEntry,
        'filetoupload'
    );
}


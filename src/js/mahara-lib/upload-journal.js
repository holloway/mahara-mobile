/*jshint esnext: true */
import httpLib      from './http-lib.js';

const wsfunction = 'module_mobileapi_upload_blog';

export default function uploadJournal(journalEntry, successCallback, errorCallback) {
    if (!this.getWwwroot() || !this.getAccessToken()) {
        return errorCallback({
                error: true,
                message: "You have not yet connected to a Mahara instance.",
                journalEntry: journalEntry
        });
    }

    if (!this.sync || !this.sync.blogs || this.sync.blogs.length === 0){
        return errorCallback({
            error: true,
            message: "No blogs configured on the server.",
            journalEntry: journalEntry
        });
    }

    httpLib.callWebservice(
        wsfunction,
        {
            blogid: parseInt(that.sync.blogs[0].id, 10),
            title: journalEntry.title,
            body: journalEntry.body,
            tags: journalEntry.tags,
        },
        function winFn(responsejson) {
            journalEntry.id = responsejson.blogpost;
            successCallback({journalEntry: journalEntry});
        },
        function failureFrom(response) {
            if (!response) response = { error: true };
            response.journalEntry = journalEntry;
            errorCallback(response);
        }
    );
}

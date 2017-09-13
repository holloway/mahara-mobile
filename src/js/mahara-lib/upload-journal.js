/*jshint esnext: true */
import httpLib      from './http-lib.js';

const wsfunction = 'module_mobileapi_upload_blog_post';

export default function uploadJournal(journalEntry, successCallback, errorCallback) {
    if (!this.getWwwroot() || !this.getWSToken()) {
        return errorCallback({
                error: true,
                message: "You have not yet connected to a Mahara instance.",
                journalEntry: journalEntry
        });
    }

    if (!this.getDefaultBlogId()){
        return errorCallback({
            error: true,
            message: "No blogs configured on the server.",
            journalEntry: journalEntry
        });
    }

    httpLib.callWebservice(
        wsfunction,
        {
            blogid: journalEntry.targetBlogId,
            title: journalEntry.title,
            body: journalEntry.body,
            tags: journalEntry.tags,
            isdraft: false
        },
        function winFn(responsejson) {
            journalEntry.id = responsejson.blogpost;
            successCallback({journalEntry: journalEntry});
        },
        function failFn(response) {
            if (!response) response = { error: true };
            response.journalEntry = journalEntry;
            errorCallback(response);
        }
    );
}

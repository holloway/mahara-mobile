/*jshint esnext: true */

export function arrayRemoveIf(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
}
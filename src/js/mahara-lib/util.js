/*jshint esnext: true */

export function dataURItoBlob(dataURI) {
  // dataURI looks like "data:application/javascript;base64,KGZ1bmN0aW9uKCl7..."
  var dataURIParts = dataURI.split(','),
      mimeType = dataURIParts[0].indexOf(";") !== -1 ? dataURIParts[0].replace(/^data:/,'').replace(/;base64/, '') : 'image/jpeg';

  var binary = atob(dataURIParts[1]);
  var blobArray = new Uint8Array(binary.length);
  for(var i = 0; i < binary.length; i++) {
      blobArray[i] = binary.charCodeAt(i);
  }
  return new Blob([blobArray], {type: mimeType});
}

export function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
}
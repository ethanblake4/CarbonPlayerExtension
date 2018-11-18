// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

console.log('Loaded Carbon content script');
/** @type {Map} */
var xhrs = new Map();

window.addEventListener('message', function (event) {
  // We only accept messages from ourselves
  if (event.source !== window) return

  if (event.data.type && (event.data.type === 'CARBON_PLAYER')) {
    console.log('Content script received: ' + event.data.text)
    switch (event.data.what) {
      case 'new_xhr':
        let xhr_id = event.data.xhr_id;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          let response = {
            'xhr_id': xhr_id,
            'readyState': this.readyState,
            'status': this.status,
            'statusText': this.statusText,
            'responseText': this.responseText
          }
          window.postMessage(response, event.source);
        }
        xhrs.set(xhrID, xhr);
        break;
      case 'xhr_open':
        xhrs.get(event.data.xhr_id).open(event.data.param1, event.data.param2)
        break;
      case 'xhr_set_request_header':
        xhrs.get(event.data.xhr_id).setRequestHeader(event.data.param1, event.data.param2)
        break;
      case 'xhr_send':
        xhrs.get(event.data.xhr_id).send();
        break;
      case 'xhr_send_1':
        xhrs.get(event.data.xhr_id).send(event.data.param1);
        break;
    }
  }
}, false);

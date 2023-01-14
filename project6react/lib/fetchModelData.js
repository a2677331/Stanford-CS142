var Promise = require("Promise");

  /**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * 
  * 
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * 
  * 
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  */
  function fetchModel(url) {
    return new Promise(function(resolve, reject) {
        console.log("Fetching data from: ", url);

        // Load via AJAX
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {

          // if request is not in ready state, continue.
          if (this.readyState !== 4) {
            return;
          }

          // if response is in wrong status
          if (this.status !== 200) {
            // handle error
            setTimeout(()=>reject(new Error({ status: this.status, statusText: this.statusText })), 0);
          }

          // a function to be executed whenever the readyState changes.
          if (this.readyState===4 && this.status===200) {
            // On Success return:
            resolve({ data: JSON.parse(this.responseText) });
          } 
        };
        
        // Send request to server, the path is url variable
        request.open("GET", url, true); 
        // Start the request sending 
        request.send();
    });
}

export default fetchModel;

/** Javascript library for making asynchronous XMLHttpRequests (XHR) to Servers
 *
 * Requires the utility library developed by Laurkan Rodriguez under the name utils
 * Location of the dependecy is the github repository at ...
 *
 * @author: Laurkan Rodriguez
 */


import utils from "./library.js";

var xhr = function(){


   /** The strings representing the types of responses
    * allowed by the XMLHttpRequest.
    *
    * Used in validation and satization of the response_type parameter
    * in the promiseXHR() method.
    */
   let responseTypeLiterals ={
     default: "",
     allowedTypes: [
       "text",
       "arraybuffer",
       "blob",
       "document",
       "json"
    ]
   };

   /** Defines the allowed methods that an XMLHttpRequest is able to
    * use for the method field.
    *
    * Note: Only GET and POST currently supported.
    */
   let methodLiterals = {
     default: "get",
     allowed: [
       "get",
       "post"
       ]
   };

   /** Validates and, if necessary, sanitizes a given method
    * string in order to prevent bad input and injection to the method
    * field of the XMLHttpRequest.
    *
    * @param {string} [method=null] The method value to validate.
    */
   function validateAndSanitizeMethod(method=null){
     if(utils.isString(method)){
       method = method.toLowerCase().trim();
     }
     if(utils.isArray(methodLiterals.allowed)){
       for(let i = 0; i < methodLiterals.allowed.length; i++){
         if(utils.isString(method, methodLiterals.allowed[i].toLowerCase().trim())){
           return methodLiterals.allowed[i];
         }else{
           continue;
         }
       }
       return methodLiterals.default;
     }else{
       return methodLiterals.default;
     }
   }

   /** Validates and, if necessary, sanitizes a given response type
    * string in order to prevent bad input and injection to the response type
    * field of the XMLHttpRequest.
    *
    * @param {string} [responseType=null] The response_type to validate.
    */
   function validateAndSanitizeResponseType(response_type=null){
     // Sanitize input
     if(utils.isString(response_type)){
       response_type = response_type.toLowerCase().trim();
     }
     if(utils.isArray(responseTypeLiterals.allowedTypes)){
       for(let i = 0; i < responseTypeLiterals.allowedTypes.length; i++){
         if(utils.isString(response_type, responseTypeLiterals.allowedTypes[i].toLowerCase().trim())){
           return responseTypeLiterals.allowedTypes[i];
         }else{
           continue;
         }
       }
       return responseTypeLiterals.default;
     }else{
       return responseTypeLiterals.default;
     }
   }

   /** Creates a Promise for performing XMLHttpRequests
    * to obtain a file from a URL, or appropiate file path.
    *
    * The default setting is for the XMLHttpRequest to be ascyhronous.
    *
    */
   function promiseXHR(file_path, method=null, header_object=null, response_type=null, request_params=null, asych=true){
     return new Promise(function(success, failure){
       let xhr_obj = new XMLHttpRequest();
       xhr_obj.open(validateAndSanitizeMethod(method), file_path, utils.toBoolean(asych)); // TO DO: Validation for the file_path.

       // Set the Header for the XMLHttpRequest if an appropiate one is given.
       if(utils.isObject(header_object)){ // assumes that header_object is dictionary of Header key, value pairs
         let headKeys = Object.keys(header_object);
         for(let i = 0; i < headKeys.length; i++){
           if(utils.isString(headKeys[i]) && utils.isString(header_object[headKeys[i]])){
             xhr_obj.setRequestHeader(headKeys[i], header_object[headKeys[i]]);
           }else{
             continue;
           }
         }
       }

       // All Headers Added

       // Set the Response Type
       xhr_obj.responseType = validateAndSanitizeResponseType(response_type);

       // Set the onload event handler to be the call to the success function passed to the promise.
       xhr_obj.onload = function(){
         let obj = {status: this.status, statusText: xhr_obj.statusText, response: xhr_obj.response};
         if(xhr_obj.responseType == null || xhr_obj.responseType == undefined || xhr_obj.responseType == "" || xhr_obj.responseType == "text"){
           obj.responseText = xhr_obj.responseText;
         }
         success(obj);
       };

       // Set the onerror event handler to be the call to the failure function passed to the promise.
       xhr_obj.onerror = function(){
         let obj = {status: this.status, statusText: xhr_obj.statusText, response: xhr_obj.response};
         if(xhr_obj.responseType == null || xhr_obj.responseType == undefined || xhr_obj.responseType == "" || xhr_obj.responseType == "text"){
           obj.responseText = xhr_obj.responseText;
         }
         failure(obj);
       };

       // Sends the actual XMLHttpRequest

       xhr_obj.send(request_params);


     });
   }

   return {
     "promiseXHR": promiseXHR
   };

 }();


export default xhr;

/*client side code*/
exports.documentReady = function(hook_name, args, cb) { 
      var message = {
        type : 'myButton',
        action : 'buttonclick'
      };
      $('#myButton').click(function() {
        pad.collabClient.sendMessage(message);
        console.log('button click front end');
      });
      // console.log("Sent message", message);
      // pad.collabClient.sendMessage(message);  // Send the cursor position message to the serve
  return cb();
}

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  /* I NEED A REFACTOR, please */
  // A huge problem with this is that it runs BEFORE the dom has been updated so edit events are always late..
  console.log('received some message from banckend to front end');
  var action = context.payload.action;
  console.log('context is', context);
  if(action === 'buttonclick'){ 
    // an author has sent this client a cursor position, we need to show it in the dom
    console.log('button clicked');
  };
 return cb();
}

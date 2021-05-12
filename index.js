'use strict';
/** *
* sessionID: Cookies.get('sessionID'),
* Responsible for negotiating messages between two clients
* bharath naik worked here
****/
/*Server side code*/
const api = require('../ep_etherpad-lite/node/db/API');
const eejs = require('../ep_etherpad-lite/node/eejs/');
var settings = require('../ep_etherpad-lite/node/utils/Settings');

const authorManager = require('ep_etherpad-lite/node/db/AuthorManager');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const authorize = require('ep_etherpad-lite/node/hooks/express/webaccess');

exports.eejsBlock_editbarMenuRight = function (hook_name, args, cb) {

args.content = args.content += "<button class='buttonicon' id='myButton'> Time+</button>";
  console.log('button plugin loaded');
  return cb();
};

exports.handleMessage = async (hookName, context) => {
  console.log('some mesg from front end');
  // Firstly ignore any request that aren't about myButton
  const {message: {type, data = {}} = {}} = context || {};
  if (type !== 'COLLABROOM' || data.type !== 'myButton') return;
  const message = data;
  console.log('mesg variable', message);
  /** *
    What's available in a message?
     * action -- The action IE extending session
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if (message.action === 'buttonclick') {
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {action: 'buttonclick'},
      },
    };
    sendToRoom(message, msg);
  }
  return null; // null prevents Etherpad from attempting to process the message any further.
};

const sendToRoom = (message, msg) => {
  // Todo write some buffer handling for protection and to stop DDoS
  // myAuthorId exists in message.
  const bufferAllows = true;
  if (bufferAllows) {
    // We have to do this because the editor hasn't redrawn by the time the cursor has arrived
    setTimeout(() => {
      padMessageHandler.handleCustomObjectMessage(msg, false, () => {
        // TODO: Error handling.
      });
    }
    , 500);
  }
};

exports.authorize = (hook, context, cb) => {
  console.log('authorize context please *********************');
  return cb([]);
  const user = context.req.session.user;
  const path = context.req.path;  // or context.resource
  if (user && path) return cb([false]);
  if (user && path) return cb([true]);
  return cb([true]);  // Let the next authorization plugin decide
};

exports.authenticate = (hook_name, context, cb) => {
  console.log("***** authinicatecontext");
  return cb([]);
  const username = authenticate(context);
  if (!username) {
    console.warn(`ep_myplugin.authenticate: Failed authentication from IP ${context.req.ip}`);
    return cb([false]);
  }
  console.info(`ep_myplugin.authenticate: Successful authentication from IP ${context.req.ip} for user ${username}`);
  const users = context.users;
  if (!(username in users)) users[username] = {};
  users[username].username = username;
  context.req.session.user = users[username];
  return cb([true]);
};

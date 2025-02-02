const ActionTypes = require("../constants/actionTypes");

function IsValidAction(action) {
  return Object.values(ActionTypes).includes(action);
}

module.exports = { IsValidAction };

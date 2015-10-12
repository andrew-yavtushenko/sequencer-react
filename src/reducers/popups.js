var actions = require('actions/popups');

module.exports = function popups(state = [], action) {
  if (action.type === actions.OPEN_POPUP) {
    return [
      {
        popupClass: action.popupClass,
        data: action.data,
        position: action.position
      }
    ];
  }

  if (action.type === actions.CLOSE_POPUP) {
    return [];
  }

  return state;
};

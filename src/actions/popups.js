var OPEN_POPUP = 'OPEN_POPUP';
var CLOSE_POPUP = 'CLOSE_POPUP';

module.exports = {
  OPEN_POPUP: OPEN_POPUP,
  CLOSE_POPUP: CLOSE_POPUP,
  open({ data, popupClass, position}) {
    return {
      type: OPEN_POPUP,
      popupClass: popupClass,
      data: data,
      position: position
    };
  },
  close() {
    return {
      type: CLOSE_POPUP
    };
  }
};

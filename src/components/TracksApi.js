'use strict';
var Promise = require('bluebird');


function getTrack (id) {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (event) {
      var resp = JSON.parse(event.target.response);
      var track = JSON.parse(resp.data);
      resolve(track);
    }, false);

    xhr.open('GET', '/items/' + id);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.send();
  });
}

function deleteTrack (id) {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', resolve, false);

    xhr.open('DELETE', '/items/' + id);

    xhr.send();
  });
}

function saveTrack (track, existingID) {

  return new Promise(function (resolve) {

    var str = JSON.stringify(track);
    var item = JSON.parse(str);
    var data = {
      title: item.name,
      data: JSON.stringify(item),
      track: true,
      shared: true
    };

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (event) {
      var response = JSON.parse(event.target.response);
      var trackData = JSON.parse(response.data);
      var id = response.id;
      resolve({
        id: id,
        track: trackData
      });
    }, false);

    if (existingID) {
      xhr.open('PUT', '/items/' + existingID);
    } else {
      xhr.open('POST', '/items');
    }

    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    var payload = JSON.stringify(data);
    xhr.send(payload);
  });
}

module.exports = {
  getTrack: getTrack,
  deleteTrack: deleteTrack,
  saveTrack: saveTrack
};

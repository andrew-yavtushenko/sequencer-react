'use strict';

var React = require('react/addons');
var Track = require('./Track');


var TrackList = React.createClass({
  render: function() {
    var trackNodes = this.props.data.tracks.map(function(track) {
      return (
        <Track id={track.id} name={track.name} onClick={this.props.onTrackSelect}/>
      );
    }.bind(this));
    return (
      <ul className='TrackList'>
        {trackNodes}
      </ul>
    );
  }
});

module.exports = TrackList;

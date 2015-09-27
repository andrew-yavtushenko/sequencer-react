'use strict';

var React = require('react/addons');
var TrackWrapper = require('./TrackWrapper');

var Track = React.createClass({
  handleClick: function (e) {
    e.preventDefault();
    var currentTrack = TrackWrapper.getTrackById(this.props.id);
    this.props.onClick(currentTrack);
  },
  render: function() {
    return (
      <li id={this.props.id} className='Track'>
        <a href='#' onClick={this.handleClick}>
          {this.props.name}
        </a>
      </li>
    );
  }
});

module.exports = Track;

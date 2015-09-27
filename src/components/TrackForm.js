'use strict';

var React = require('react/addons');
var TrackWrapper = require('./TrackWrapper');

var TrackForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var newTrackName = React.findDOMNode(this.refs.name).value.trim();
    var newTrack = TrackWrapper.createTrack(newTrackName);
    this.props.onTrackSubmit(newTrack);
    React.findDOMNode(this.refs.name).value = '';
  },
  render: function() {
    return (
      <form className='TrackForm' onSubmit={this.handleSubmit}>
        <input type='text' ref='name' placeholder='New track name' />
        <input type='submit' value='Create track' />
      </form>
    );
  }
});

module.exports = TrackForm;

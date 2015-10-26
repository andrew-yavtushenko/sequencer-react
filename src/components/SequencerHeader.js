'use strict';

var React = require('react/addons');
var Context = require('components/Context');
var Auth = require('components/AuthComponent');

var SequencerHeader = React.createClass({
  getInitialState: function () {
    return {
      ulocked: false
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    Context.unlock(function () {
      console.log('context unlocked');
      this.state.unlocked = true;
      this.setState(this.state);
    }.bind(this));
    this.props.onTrackCreate();
  },
  render: function () {
    return (
      <div id='SequencerHeader'>
        <h1>sequencer</h1>
        <ul className='nav nav-left'>
          <li><a href='#' onClick={this.handleSubmit} className='new-track'>New Track</a></li>
          <li style={{display: 'none'}}><a href='#' className='catalogue'>Catalogue</a></li>
        </ul>
        <ul style={{display: 'none'}} className='nav nav-right'>
          <li><a href='#' className='my-library'>My Library</a></li>
          <li><a href='#' className='settings'>Settings</a></li>
          <li><a href='#' className='logout'>logout</a></li>
        </ul>
        <Auth />
        <div className="clear"></div>
      </div>
    );
  }
});

module.exports = SequencerHeader;

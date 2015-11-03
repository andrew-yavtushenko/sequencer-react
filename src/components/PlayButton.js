'use strict';

var React = require('react/addons');
var Context = require('./Context');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },
  componentDidMount: function () {
    window.addEventListener('keyup', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.keyCode === 32 && e.target.tagName !== 'INPUT') {
        this.performAction(event);
      }
    }.bind(this), false);
  },
  performPlay: function () {
    this.state.isPlaying = true;
    this.props.play();
    this.setState(this.state);
  },
  play: function () {
    if (Context.isUnlocked()) {
      this.performPlay();
    } else {
      Context.unlock(this.performPlay);
    }
  },
  stop: function () {
    this.state.isPlaying = false;
    this.props.stop();
    this.setState(this.state);
  },
  performAction: function (event) {
    event.preventDefault();
    event.stopPropagation();
    this.state.isPlaying
      ? this.stop()
      : this.play();
  },
  render: function () {
    return (
      <div className="PlayButton" style={{display: this.props.canPlay() ? 'block' : 'none'}}>
        <a href="#" onClick={this.performAction} className='play-pause'>{
          this.state.isPlaying
            ? <span>stop</span>
            : <span>play</span>
        }</a>
        <a href="#" onClick={this.props.compile} className='compile'>.wav</a>
        <p>YOU CAN ALSO PRESS THE SPACEBAR TO PLAY AND STOP TRACK</p>
      </div>
    );
  }
});

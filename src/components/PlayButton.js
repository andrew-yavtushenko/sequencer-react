'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },
  componentDidMount: function () {
    window.addEventListener('keyup', function (e) {
      e.preventDefault();
      if (e.keyCode === 32) {
        this.handleCall();
      }
    }.bind(this), false);
  },
  play: function () {
    this.state.isPlaying = true;
    this.props.play();
    this.setState(this.state);
  },
  stop: function () {
    this.state.isPlaying = false;
    this.props.stop();
    this.setState(this.state);
  },
  handleCall: function (event) {
    event.preventDefault();
    event.stopPropagation();
    this.state.isPlaying
      ? this.stop()
      : this.play();
  },
  render: function () {
    return (
      <div className="PlayButton" style={{display: this.props.canPlay() ? 'block' : 'none'}}>
        <a href="#" onClick={this.handleCall} className='play-pause'>{
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

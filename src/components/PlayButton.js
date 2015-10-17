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
  handleCall: function () {
    this.state.isPlaying
      ? this.stop()
      : this.play();
  },
  render: function () {
    return (
      <div className="PlayButton" style={{display: this.props.canPlay() ? 'block' : 'none'}}>
        <a href="#" onClick={this.handleCall}>{
          this.state.isPlaying
            ? <span>stop</span>
            : <span>play</span>
        }</a>
        <p>YOU CAN ALSO PRESS THE SPACEBAR TO PLAY AND STOP TRACK</p>
      </div>
    );
  }
});

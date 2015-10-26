'use strict';

var React = require('react/addons');

function checkAuth (successCallback, unauthenticatedCallback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'text';

  xhr.addEventListener('load', function (e) {
    if (e.target.status === 404) {
      unauthenticatedCallback(JSON.parse(e.target.response));
    } else {
      successCallback(JSON.parse(e.target.response));
    }
  }, false);

  xhr.open('GET', '/users/current');
  xhr.send(null);
}

module.exports = React.createClass({
  getInitialState: function () {
    return {
      checked: false,
      authenticated: false
    };
  },
  componentDidMount: function () {
    checkAuth(this.authenticated, this.unauthenticated);
  },
  authenticated: function (resp) {
    this.state.checked = true;
    this.state.authenticated = true;
    this.state.userData = resp.user;
    this.setState(this.state);
  },
  unauthenticated: function (resp) {
    this.state.checked = true;
    this.state.authenticated = false;
    this.state.authOptions = resp;
    this.setState(this.state);
  },
  renderAuthOptions: function () {
    return (
      <ul className="authOptions">{
        this.state.authOptions.login.map(function (authOption, key) {
          return (
            <li key={key}>
              <a href={authOption.url}>{authOption.name}</a>
            </li>
          );
        })
      }</ul>
    );
  },
  getItems: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'text';
    xhr.addEventListener('load', function (event) {
      console.log(event.target.status);
      console.log(JSON.parse(event.target.response));
    }, false);

    xhr.open('GET', '/items');
    xhr.send(null);
  },
  renderUserData: function () {
    return (
      <ul className="user-data">
        <li>
          <a href="#" onClick={this.getItems}>Library</a>
        </li>
        <li className="user">
          <img src={this.state.userData.image_url} alt={this.state.userData.name}/>
          {this.state.userData.name}
        </li>
        <li className="logout">
          <a href="/logout">logout</a>
        </li>
      </ul>
    );
  },
  renderAuthState: function () {
    return this.state.authenticated
      ? this.renderUserData()
      : this.renderAuthOptions();
  },
  render: function () {
    return (
      <div className="auth nav nav-right">{
        this.state.checked
          ? this.renderAuthState()
          : void 0
      }</div>
    );
  }
});

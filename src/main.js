'use strict';

require.context('./worker/', true, /\.js$/);

var SequencerReactApp = require('./containers/SequencerReactApp');
var React = require('react');
var { Provider } = require('react-redux');
var configureStore = require('./store/configureStore');
var store = configureStore();

React.render(
  <Provider store={store}>
      {() => <SequencerReactApp />}
  </Provider>,
  document.getElementById('content')
);

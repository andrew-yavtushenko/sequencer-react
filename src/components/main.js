'use strict';

var SequencerReactApp = require('./SequencerReactApp');
var React = require('react');
// var Router = require('react-router');
// var Route = Router.Route;

require.context('../worker/', true, /\.js$/);

// var Routes = (
//   <Route handler={SequencerReactApp}>
//     <Route name="/" handler={SequencerReactApp}/>
//   </Route>
// );

// Router.run(Routes, function (Handler) {
//   React.render(<Handler/>, content);
// });

React.render(<SequencerReactApp />, document.body);

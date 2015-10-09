var { createStore, applyMiddleware } = require('redux');
var createLogger = require('redux-logger');
var thunkMiddleware = require('redux-thunk');
var rootReducer = require('../reducers');

var loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true
});

var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)(createStore);

module.exports = function configureStore(initialState) {
    var store = createStoreWithMiddleware(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            var nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

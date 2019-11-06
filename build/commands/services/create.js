// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../services/http-client.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeClient;
exports.getConfig = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _axiosEndpoints = _interopRequireDefault(require("axios-endpoints"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getConfig = () => ({
  user: 'test',
  password: 'test',
  baseURL: 'http://127.0.0.1:3000',
  logger: {
    trace: () => {},
    info: () => {},
    error: () => {}
  }
});

exports.getConfig = getConfig;

function makeClient({
  user,
  password,
  baseURL,
  logger
}) {
  const axiosInstance = _axios.default.create({
    baseURL,
    paramsSerializer: function (params) {
      return _qs.default.stringify(params);
    }
  });

  const Endpoint = (0, _axiosEndpoints.default)(axiosInstance);
  const authEndpoint = new Endpoint('/auth/login');
  const TWO_PARAM_METHODS = ['post', 'put', 'patch'];

  const createAuthHeader = token => ({
    'Authorization': `Bearer ${token}`
  });

  const decorateEnpointParams = (params, paramIndex, headers) => {
    const paramsCopy = params.slice(0);
    const [options] = paramsCopy.slice(paramIndex);
    if (!options) paramsCopy.splice(paramIndex, 1, {
      headers: headers
    });else paramsCopy.splice(paramIndex, 1, Object.assign({}, options, {
      headers: headers
    }));
    return paramsCopy;
  };

  logger.trace({
    axiosInstance
  }, 'axios client');
  return {
    authToken: null,

    async login() {
      return await authEndpoint.post({
        email: user,
        password
      });
    },

    makeEndpointWithAuth(path) {
      logger.trace({
        path
      }, 'makeEndpointWithAuth');
      const client = this;
      const endpoint = new Endpoint(path);
      const authorizationHandler = {
        get(target, propKey) {
          const origProperty = target[propKey];
          logger.trace({
            origProperty
          }, 'Trap function call in endpoint');

          if (typeof origProperty !== 'function') {
            return origProperty;
          }

          return async function (...args) {
            const optionParamIndex = TWO_PARAM_METHODS.indexOf(origProperty) > -1 ? 1 : 0;
            const params = decorateEnpointParams(args, optionParamIndex, createAuthHeader(client.authToken));
            logger.trace({
              optionParamIndex,
              params
            }, 'Call params');

            try {
              const response = await origProperty.apply(this, params);
              const {
                status
              } = response;
              logger.info({
                status
              }, 'Http client response status');
              return response;
            } catch (error) {
              logger.error({
                error
              }, 'Http client error');

              if (!error.response || error.response.status !== 401) {
                throw error;
              }

              const {
                status
              } = error.response;

              try {
                logger.trace({
                  status
                }, 'Try to sign in');
                const {
                  data: {
                    token
                  }
                } = await client.login();
                client.authToken = token;
                logger.trace({
                  token
                }, 'Token');
                logger.trace('Run request after login');
                const response = await origProperty.apply(this, decorateEnpointParams(params, optionParamIndex, createAuthHeader(client.authToken)));
                logger.info({
                  status
                }, 'Http client secodresponse status');
                return response;
              } catch (error) {
                logger.error({
                  error
                }, 'Login error');
                throw error;
              }
            }
          };
        }

      };
      return new Proxy(endpoint, authorizationHandler);
    }

  };
}
},{}],"../services/wp-manager-client.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createWPManagerClient;

var _httpClient = _interopRequireDefault(require("../services/http-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createWPManagerClient({
  user,
  password,
  baseURL,
  logger
}) {
  const client = (0, _httpClient.default)({
    user,
    password,
    baseURL,
    logger
  });
  const projectsEndpoint = client.makeEndpointWithAuth('/wordpress-project');
  return {
    createWordpressProject: params => projectsEndpoint.post(params),
    getProjectServicesStatuses: name => {
      const projectServicesEndpoint = client.makeEndpointWithAuth(`/wordpress-project/${name}/services`);
      return projectServicesEndpoint.get();
    },
    destroyProjectServices: name => client.makeEndpointWithAuth(`/wordpress-project/${name}/services`).delete(),
    startProjectServices: name => client.makeEndpointWithAuth(`/wordpress-project/${name}/services`).post({
      command: 'restart'
    }),
    stopProjectServices: name => client.makeEndpointWithAuth(`/wordpress-project/${name}/services`).post({
      command: 'stop'
    }),
    createProjectServices: name => client.makeEndpointWithAuth(`/wordpress-project/${name}/services`).post({
      command: 'up'
    }),
    installProjectServiceWordpress: params => client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress`).post(params),
    installWordpressPlugins: params => client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress/plugins`).post(params),
    getWordpressPackages: name => client.makeEndpointWithAuth(`/wordpress-project/${name}/services/wordpress/packages`).get()
  };
}
},{"../services/http-client":"../services/http-client.js"}],"../components/LoadingIndicator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ink = require("ink");

var _inkSpinner = _interopRequireDefault(require("ink-spinner"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const LoadingIndicator = ({
  isLoading,
  loadingMessage = 'Fetching data from server'
}) => _react.default.createElement(_react.Fragment, null, isLoading ? _react.default.createElement(_ink.Box, null, _react.default.createElement(_ink.Color, {
  green: true
}, _react.default.createElement(_inkSpinner.default, {
  type: "point"
})), _react.default.createElement(_ink.Text, {
  bold: true
}, loadingMessage)) : '');

LoadingIndicator.propTypes = {
  isLoading: _propTypes.default.bool.isRequired,
  loadingMessage: _propTypes.default.string.isRequired
};
var _default = LoadingIndicator;
exports.default = _default;
},{}],"../components/Fetcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ink = require("ink");

var _LoadingIndicator = _interopRequireDefault(require("./LoadingIndicator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const DisplayData = ({
  data
}) => _react.default.createElement(_react.Fragment, null, data === undefined ? _react.default.createElement(_ink.Text, null, "No data yet") : _react.default.createElement(_ink.Text, null, data));

const DisplayError = ({
  error
}) => _react.default.createElement(_react.Fragment, null, error ? _react.default.createElement(_ink.Color, {
  red: true
}, _react.default.createElement(_ink.Text, null, error)) : _react.default.createElement(_ink.Text, null, " "));

const Fetcher = ({
  beforeLoadingMessage,
  DataDisplayer = DisplayData,
  ErrorDisplayer = DisplayError,
  fetchData,
  dataMapper = data => data,
  errorHandler = error => error.toString()
}) => {
  const [isLoading, setIsLoading] = (0, _react.useState)(false);
  const [data, setData] = (0, _react.useState)();
  const [error, setError] = (0, _react.useState)('');
  const onLoad = setIsLoading;

  const onData = response => {
    setData(dataMapper(response));
  };

  const onError = error => {
    setError(errorHandler(error));
  };

  (0, _react.useEffect)(() => {
    async function fetch() {
      try {
        onLoad(true);
        const response = await fetchData.call();
        onData(response);
        onLoad(false);
      } catch (error) {
        onLoad(false);
        onData(null);
        onError(error);
      }
    }

    fetch();
  }, [fetchData]);
  return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_ink.Box, null, _react.default.createElement(_LoadingIndicator.default, {
    isLoading: isLoading,
    loadingMessage: beforeLoadingMessage
  })), _react.default.createElement(_ink.Box, null, _react.default.createElement(DataDisplayer, {
    data: data
  })), _react.default.createElement(_ink.Box, null, _react.default.createElement(ErrorDisplayer, {
    error: error
  })));
};

Fetcher.propTypes = {
  afterLoadingMessage: _propTypes.default.string,
  beforeLoadingMessage: _propTypes.default.string,
  fetchData: _propTypes.default.func.isRequired,
  dataMapper: _propTypes.default.func,
  errorHandler: _propTypes.default.func
};

var _default = (0, _react.memo)(Fetcher);

exports.default = _default;
},{"./LoadingIndicator":"../components/LoadingIndicator.js"}],"services/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ink = require("ink");

var _wpManagerClient = _interopRequireDefault(require("../../services/wp-manager-client"));

var _httpClient = require("../../services/http-client");

var _Fetcher = _interopRequireDefault(require("../../components/Fetcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const wpManagerClient = (0, _wpManagerClient.default)((0, _httpClient.getConfig)()); /// Create services

const Create = ({
  name,
  onData = () => {}
}) => {
  return _react.default.createElement(_ink.Box, {
    flexDirection: "column"
  }, _react.default.createElement(_Fetcher.default, {
    fetchData: wpManagerClient.createProjectServices.bind(null, name),
    beforeLoadingMessage: `Start "${name}" project's services `,
    dataMapper: response => {
      onData(response);
      return response && response.status === 200 ? 'Services have been started.' : 'Something went wrong';
    }
  }));
};

Create.propTypes = {
  /// Name of the project
  name: _propTypes.default.string.isRequired
};

var _default = (0, _react.memo)(Create);

exports.default = _default;
},{"../../services/wp-manager-client":"../services/wp-manager-client.js","../../services/http-client":"../services/http-client.js","../../components/Fetcher":"../components/Fetcher.js"}]},{},["services/create.js"], null)
//# sourceMappingURL=/services/create.js.map
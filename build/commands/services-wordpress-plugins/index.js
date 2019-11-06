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
},{"../services/http-client":"../services/http-client.js"}],"../components/SelectInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SelectInput;

var _react = _interopRequireDefault(require("react"));

var _inkSelectInput = _interopRequireDefault(require("ink-select-input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function SelectInput(_ref) {
  let {
    onSubmit,
    onBlur,
    onChange,
    onFocus
  } = _ref,
      props = _objectWithoutProperties(_ref, ["onSubmit", "onBlur", "onChange", "onFocus"]);

  _react.default.useEffect(() => {
    onFocus();
    return onBlur;
  }, [onFocus, onBlur]);

  return _react.default.createElement(_inkSelectInput.default, _extends({}, props, {
    onSelect: ({
      value
    }) => {
      onChange(value);
      onSubmit();
    }
  }));
}
},{}],"../utils/hooks/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

const fetchHook = ({
  onSuccess,
  onLoad,
  onFailed,
  fetchData
}) => {
  return () => {
    async function fetch() {
      try {
        onLoad(true);
        const response = await fetchData.call();
        onSuccess(response);
        onLoad(false);
      } catch (error) {
        onLoad(false);
        onSuccess(null);
        onFailed(error);
      }
    }

    fetch();
  };
};

var _default = fetchHook;
exports.default = _default;
},{}],"../components/DynamicSelect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ink = require("ink");

var _SelectInput = _interopRequireDefault(require("./SelectInput"));

var _fetch = _interopRequireDefault(require("../utils/hooks/fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DynamicSelect = ({
  label,
  selectProps,
  hookProps,
  toItems = () => []
}) => {
  const {
    onSuccess = () => {},
    onLoad = () => {},
    onFailed = () => {},
    fetchData = () => {}
  } = hookProps;
  const [items, setItems] = (0, _react.useState)([]);
  (0, _react.useEffect)((0, _fetch.default)({
    onSuccess: ({
      data
    }) => setItems(toItems(data)),
    onLoad,
    onFailed: error => console.log('ERROR', error),
    fetchData
  }), []);
  return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_ink.Text, {
    bold: true
  }, label), _react.default.createElement(_SelectInput.default, _extends({}, selectProps, {
    items: items
  })));
};

var _default = (0, _react.memo)(DynamicSelect);

exports.default = _default;
},{"./SelectInput":"../components/SelectInput.js","../utils/hooks/fetch":"../utils/hooks/fetch.js"}],"../components/PackageSelector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DynamicSelect = _interopRequireDefault(require("./DynamicSelect"));

var _wpManagerClient = _interopRequireDefault(require("../services/wp-manager-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const wpManagerClient = (0, _wpManagerClient.default)({
  user: 'test',
  password: 'test',
  baseURL: 'http://127.0.0.1:3000',
  logger: {
    trace: () => {},
    info: () => {},
    error: () => {}
  }
}); /// Wordpress commands

const PackageSelector = ({
  onSelect,
  onSubmit
}) => {
  return _react.default.createElement(_DynamicSelect.default, {
    label: "Select from predefined package",
    selectProps: {
      onSubmit,
      onFocus: onSelect,
      onChange: onSelect,
      name: 'package'
    },
    hookProps: {
      fetchData: wpManagerClient.getWordpressPackages.bind(null, 'bela')
    },
    toItems: data => {
      return Object.keys(data).map(item => ({
        label: item.toUpperCase(),
        value: item
      }));
    }
  });
};

var _default = (0, _react.memo)(PackageSelector);

exports.default = _default;
},{"./DynamicSelect":"../components/DynamicSelect.js","../services/wp-manager-client":"../services/wp-manager-client.js"}],"services-wordpress-plugins/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ink = require("ink");

var _wpManagerClient = _interopRequireDefault(require("../../services/wp-manager-client"));

var _PackageSelector = _interopRequireDefault(require("../../components/PackageSelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const wpManagerClient = (0, _wpManagerClient.default)({
  user: 'test',
  password: 'test',
  baseURL: 'http://127.0.0.1:3000',
  logger: {
    trace: () => {},
    info: () => {},
    error: () => {}
  }
}); /// Wordpress commands

const Index = () => {
  const [packageName, setPackageName] = (0, _react.useState)();
  const {
    exit
  } = (0, _ink.useApp)();
  return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_PackageSelector.default, {
    onSelect: setPackageName,
    onSubmit: exit
  }));
};

var _default = (0, _react.memo)(Index);

exports.default = _default;
},{"../../services/wp-manager-client":"../services/wp-manager-client.js","../../components/PackageSelector":"../components/PackageSelector.js"}]},{},["services-wordpress-plugins/index.js"], null)
//# sourceMappingURL=/services-wordpress-plugins/index.js.map
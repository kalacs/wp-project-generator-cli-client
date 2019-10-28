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
})({"../components/TextInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TextInput;

var _react = _interopRequireDefault(require("react"));

var _inkTextInput = _interopRequireDefault(require("ink-text-input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function TextInput(_ref) {
  let {
    onBlur,
    onFocus
  } = _ref,
      props = _objectWithoutProperties(_ref, ["onBlur", "onFocus"]);

  _react.default.useEffect(() => {
    onFocus();
    return onBlur;
  }, [onFocus, onBlur]);

  return _react.default.createElement(_inkTextInput.default, props);
}
},{}],"../components/SelectInput.js":[function(require,module,exports) {
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
},{}],"../components/MultiSelectInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MultiSelectInput;

var _react = _interopRequireDefault(require("react"));

var _inkMultiSelect = _interopRequireDefault(require("ink-multi-select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function MultiSelectInput(_ref) {
  let {
    onBlur,
    onChange,
    onFocus,
    value = []
  } = _ref,
      props = _objectWithoutProperties(_ref, ["onBlur", "onChange", "onFocus", "value"]);

  _react.default.useEffect(() => {
    onFocus();
    return onBlur;
  }, [onFocus, onBlur]);

  return _react.default.createElement(_inkMultiSelect.default, _extends({}, props, {
    onSelect: ({
      value: v
    }) => onChange(value.concat(v)),
    onUnselect: ({
      value: v
    }) => onChange(value.filter(item => item !== v))
  }));
}
},{}],"../components/Error.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Error;

var _react = _interopRequireDefault(require("react"));

var _ink = require("ink");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Error({
  children
}) {
  return _react.default.createElement(_ink.Box, null, _react.default.createElement(_ink.Color, {
    red: true
  }, children));
}
},{}],"../services/http-client.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeClient;

var _axios = _interopRequireDefault(require("axios"));

var _axiosEndpoints = _interopRequireDefault(require("axios-endpoints"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var _httpClient = _interopRequireDefault(require("./http-client"));

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
    createWordpressProject: async params => await projectsEndpoint.post(params)
  };
}
},{"./http-client":"../services/http-client.js"}],"project/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactFinalForm = require("react-final-form");

var _ink = require("ink");

var _TextInput = _interopRequireDefault(require("../../components/TextInput"));

var _SelectInput = _interopRequireDefault(require("../../components/SelectInput"));

var _MultiSelectInput = _interopRequireDefault(require("../../components/MultiSelectInput"));

var _Error = _interopRequireDefault(require("../../components/Error"));

var _inkSpinner = _interopRequireDefault(require("ink-spinner"));

var _wpManagerClient = _interopRequireDefault(require("../../services/wp-manager-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const wpManagerClient = (0, _wpManagerClient.default)({
  user: 'test',
  password: 'test',
  baseURL: 'http://127.0.0.1:3000',
  logger: {
    trace: console.log,
    info: console.log,
    error: console.error
  }
});

const createTextInput = (name, label, placeholder = '', format = value => value || '', validate = () => undefined) => ({
  name,
  label,
  placeholder,
  format,
  validate,
  Input: _TextInput.default
});

const createSelectInput = (name, label, inputConfig, format = value => value || '', validate = () => undefined) => ({
  name,
  label,
  inputConfig,
  format,
  validate,
  Input: _SelectInput.default
});

const createMultiSelectInput = (name, label, inputConfig, format = value => value, validate = undefined) => ({
  name,
  label,
  inputConfig,
  format,
  validate,
  Input: _MultiSelectInput.default
});

const fields = [createTextInput('project.prefix', 'Project prefix', 'my-awesome-project', value => value ? value.toLowerCase().replace(/[^a-z \\-]/g, '').replace(/ /g, '-') : '', value => !value ? 'Require' : undefined), createTextInput('project.path', 'Project path', '/home/user/localSites', value => value ? value.toLowerCase().replace(/[^a-z \\-]/g, '').replace(/ /g, '-') : '', value => !value ? 'Require' : undefined), createTextInput('project.database.name', 'Database name'), createTextInput('project.database.user', 'Database user'), createTextInput('project.database.password', 'Database password'), createTextInput('project.database.rootPassword', 'Database root password'), createTextInput('project.webserver.port', 'Webserver port')]; /// CliForm

const CliForm = () => {
  const [activeField, setActiveField] = _react.default.useState(0);

  const [submission, setSubmission] = _react.default.useState();

  const [isLoading, setIsLoading] = _react.default.useState(false);

  return _react.default.createElement(_reactFinalForm.Form, {
    onSubmit: async params => {
      setIsLoading(true);
      await wpManagerClient.createWordpressProject(params);
      setSubmission(params);
      setIsLoading(false);
    }
  }, ({
    handleSubmit,
    validating
  }) => _react.default.createElement(_ink.Box, {
    flexDirection: "column"
  }, fields.map(({
    name,
    label,
    placeholder,
    format,
    validate,
    Input,
    inputConfig
  }, index) => _react.default.createElement(_reactFinalForm.Field, {
    name: name,
    key: name,
    format: format,
    validate: validate
  }, ({
    input,
    meta
  }) => _react.default.createElement(_ink.Box, {
    flexDirection: "column"
  }, _react.default.createElement(_ink.Box, null, _react.default.createElement(_ink.Text, {
    bold: activeField === index
  }, label, ": "), activeField === index ? _react.default.createElement(Input, _extends({}, input, inputConfig, {
    placeholder: placeholder,
    onSubmit: () => {
      if (meta.valid && !validating) {
        setActiveField(value => value + 1); // go to next field

        if (activeField === fields.length - 1) {
          // last field, so submit
          handleSubmit();
        }
      } else {
        input.onBlur(); // mark as touched to show error
      }
    }
  })) : input.value && _react.default.createElement(_ink.Text, null, input.value) || placeholder && _react.default.createElement(_ink.Color, {
    gray: true
  }, placeholder), validating && name === 'name' && _react.default.createElement(_ink.Box, {
    marginLeft: 1
  }, _react.default.createElement(_ink.Color, {
    yellow: true
  }, _react.default.createElement(_inkSpinner.default, {
    type: "dots"
  }))), meta.invalid && meta.touched && _react.default.createElement(_ink.Box, {
    marginLeft: 2
  }, _react.default.createElement(_ink.Color, {
    red: true
  }, "\u2716")), meta.valid && meta.touched && meta.inactive && _react.default.createElement(_ink.Box, {
    marginLeft: 2
  }, _react.default.createElement(_ink.Color, {
    green: true
  }, "\u2714"))), meta.error && meta.touched && _react.default.createElement(_Error.default, null, meta.error)))), submission ? isLoading ? _react.default.createElement(_ink.Box, {
    marginLeft: 1
  }, _react.default.createElement(_ink.Color, {
    yellow: true
  }, _react.default.createElement(_inkSpinner.default, {
    type: "dots"
  }))) : 'Sent to server' : ''));
};

var _default = CliForm;
exports.default = _default;
},{"../../components/TextInput":"../components/TextInput.js","../../components/SelectInput":"../components/SelectInput.js","../../components/MultiSelectInput":"../components/MultiSelectInput.js","../../components/Error":"../components/Error.js","../../services/wp-manager-client":"../services/wp-manager-client.js"}]},{},["project/create.js"], null)
//# sourceMappingURL=/project/create.js.map
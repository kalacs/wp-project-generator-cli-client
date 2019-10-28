import axios from 'axios';
import { default as EndpointFactory } from 'axios-endpoints';
import qs from 'qs';

export const getConfig = () => ({
    user: 'test',
    password: 'test',
    baseURL: 'http://127.0.0.1:3000',
    logger: {
		trace: () => {},
		info: () => {},
		error: () => {}
	}
});

export default function makeClient({
    user,
    password,
    baseURL,
    logger
}) {
    const axiosInstance = axios.create({
        baseURL,
        paramsSerializer: function (params) {
            return qs.stringify(params);
        }
    });
    const Endpoint = EndpointFactory(axiosInstance);
    const authEndpoint = new Endpoint('/auth/login');
    const TWO_PARAM_METHODS = [
        'post',
        'put',
        'patch'
    ];
    const createAuthHeader = (token) => ({ 'Authorization' : `Bearer ${token}`});
    const decorateEnpointParams = (params, paramIndex, headers) => {
        const paramsCopy = params.slice(0);
        const [ options ] = paramsCopy.slice(paramIndex)

        if (!options) paramsCopy.splice(paramIndex, 1, { headers: headers })
        else paramsCopy.splice(paramIndex, 1, Object.assign({}, options, { headers: headers }))
        return paramsCopy;
    }
    logger.trace({ axiosInstance },'axios client');    

    return {
        authToken: null,
        async login() {
            return await authEndpoint.post({
                email: user,
                password
            })
        },
        makeEndpointWithAuth(path) {
            logger.trace({ path },'makeEndpointWithAuth');    
            const client = this;
            const endpoint = new Endpoint(path);
            const authorizationHandler = {
                get(target, propKey) {
                    const origProperty = target[propKey];
                    logger.trace({ origProperty },'Trap function call in endpoint');    

                    if (typeof origProperty !== 'function') {
                        return origProperty;
                    }

                    return async function (...args) {
                        const optionParamIndex = (TWO_PARAM_METHODS.indexOf(origProperty) > -1 ) ? 1 : 0;
                        const params = decorateEnpointParams(args, optionParamIndex, createAuthHeader(client.authToken));
                        logger.trace({ optionParamIndex, params },'Call params');    

                        try {
                            const response = await origProperty.apply(this, params);
                            const { status } = response;
                            logger.info({ status }, 'Http client response status');    

                            return response;
                        } catch (error) {
                            logger.error({ error }, 'Http client error');

                            if (!error.response || error.response.status !== 401) {
                                throw error;
                            }
                            const { status } = error.response;

                            try {
                                logger.trace({ status }, 'Try to sign in');
                                const { data: { token } } = await client.login();
                                client.authToken = token;
                                logger.trace({ token }, 'Token');                                        

                                logger.trace('Run request after login');
                                const response = await origProperty.apply(this, decorateEnpointParams(params, optionParamIndex, createAuthHeader(client.authToken)));
                                logger.info({ status }, 'Http client secodresponse status');    
    
                                return response;

                            } catch (error) {
                                logger.error({ error }, 'Login error');                                        
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
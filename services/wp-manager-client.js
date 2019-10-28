import makeClient from '../services/http-client';

export default function createWPManagerClient({
    user,
    password,
    baseURL,
    logger
  }) {
    const client = makeClient({
        user,
        password,
        baseURL,
        logger
      })  
      const projectsEndpoint = client.makeEndpointWithAuth('/wordpress-project');

    return {
        createWordpressProject: async (params) => await projectsEndpoint.post(params),
    }
}
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
        createWordpressProject: params => projectsEndpoint.post(params),
        getProjectServicesStatuses: name => {
          const projectServicesEndpoint = client.makeEndpointWithAuth(`/wordpress-project/${name}/services`);
          return projectServicesEndpoint.get();
        },
        destroyProjectServices: name => (client.makeEndpointWithAuth(`/wordpress-project/${name}/services`)).delete(),
        createProjectServices: name => (client.makeEndpointWithAuth(`/wordpress-project/${name}/services`)).post({}),
        installProjectServiceWordpress: params => (client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress`)).post(params),
    }
}
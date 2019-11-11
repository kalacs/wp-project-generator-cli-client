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
        startProjectServices: name => (client.makeEndpointWithAuth(`/wordpress-project/${name}/services`)).post({ command: 'restart' }),
        stopProjectServices: name => (client.makeEndpointWithAuth(`/wordpress-project/${name}/services`)).post({ command: 'stop' }),
        createProjectServices: name => (client.makeEndpointWithAuth(`/wordpress-project/${name}/services`)).post({ command: 'up' }),
        installProjectServiceWordpress: params => (client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress`)).post(params),
        installWordpressPlugins: params => (client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress/plugins`)).post(params),
        installWordpressTheme: params => (client.makeEndpointWithAuth(`/wordpress-project/${params.projectPrefix}/services/wordpress/theme`)).post(params),

        getWordpressPackages: () => (client.makeEndpointWithAuth(`/wordpress-project/packages`)).get(),
        getWordpressPackagesContent: packageName => (client.makeEndpointWithAuth(`/wordpress-project/packages/${packageName}`)).get(),
      }
}
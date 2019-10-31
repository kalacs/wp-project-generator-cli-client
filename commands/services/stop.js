import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import { getConfig } from '../../services/http-client';
import createWPManagerClient from '../../services/wp-manager-client';
import Fetcher from '../../components/Fetcher';

const wpManagerClient = createWPManagerClient(getConfig());

/// Stop services
const ServiceStop = ({ name }) => (
	<Box flexDirection="column" width="5000">
		<Fetcher
			fetchData={wpManagerClient.stopProjectServices.bind(null, name)}
			beforeLoadingMessage={`Stop "${name}" project's services `}
			dataMapper={({ status }) => status === 200 ? 'Services have been stopped.':'Something went wrong'}
		/>
	</Box>
);

ServiceStop.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default ServiceStop;

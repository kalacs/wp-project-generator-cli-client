import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import { getConfig } from '../../services/http-client';
import createWPManagerClient from '../../services/wp-manager-client';
import Fetcher from '../../components/Fetcher';

const wpManagerClient = createWPManagerClient(getConfig());

/// Start services
const ServiceStart = ({ name }) => (
	<Box flexDirection="column" width="5000">
		<Fetcher
			fetchData={wpManagerClient.startProjectServices.bind(null, name)}
			beforeLoadingMessage={`Start "${name}" project's services `}
			dataMapper={({ status }) => status === 200 ? 'Services have been started.':'Something went wrong'}
		/>
	</Box>
);

ServiceStart.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default ServiceStart;

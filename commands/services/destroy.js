import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import createWPManagerClient from '../../services/wp-manager-client';
import { getConfig } from '../../services/http-client';
import Fetcher from '../../components/Fetcher';

const wpManagerClient = createWPManagerClient(getConfig());
/// Destroy services
const Destroy = ({ name }) => {

	return (
		<Box flexDirection="column">
			<Fetcher
				fetchData={wpManagerClient.destroyProjectServices.bind(null, name)}
				beforeLoadingMessage={`Destroy "${name}" project's services `}
				dataMapper={({ status }) => status === 200 ? 'Services have been downed.':'Something went wrong'}
			/>
		</Box>
	);
};

Destroy.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default Destroy;

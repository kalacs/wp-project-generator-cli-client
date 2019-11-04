import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import createWPManagerClient from '../../services/wp-manager-client';
import { getConfig } from '../../services/http-client';
import Fetcher from '../../components/Fetcher';

const wpManagerClient = createWPManagerClient(getConfig());
/// Create services
const Create = ({ name, onData = () => {} }) => {
	return (
		<Box flexDirection="column">
			<Fetcher
				fetchData={wpManagerClient.createProjectServices.bind(null, name)}
				beforeLoadingMessage={`Start "${name}" project's services `}
				dataMapper={response => {
					onData(response);
					return response && response.status === 200 ? 'Services have been started.':'Something went wrong';				
				}}
			/>
		</Box>
	);
};

Create.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default memo(Create);

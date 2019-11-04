import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import { getConfig } from '../../services/http-client';
import createWPManagerClient from '../../services/wp-manager-client';
import Table from '../../components/Table';
import chalk from 'chalk';
import Fetcher from '../../components/Fetcher';

const wpManagerClient = createWPManagerClient(getConfig());

/// Get services statuses
const ServiceIndex = ({ name }) => (
	<Box flexDirection="column" width="5000">
		<Fetcher
			fetchData={wpManagerClient.getProjectServicesStatuses.bind(null, name)}
			beforeLoadingMessage={`Get ${name} project's statuses...`}
			dataMapper={response => {
				return response && response.data ? response.data.map(({ names, ports: rawPorts, status: rawStatus }) => {
					const status = /Up/.test(rawStatus) ? chalk.green('●') : chalk.red('●');
					const ports = rawPorts || chalk.italic('None');
					return {
						names,
						ports,
						status
					};
				}) : {};
			}}
			DataDisplayer={Table}
		/>
	</Box>
);

ServiceIndex.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default memo(ServiceIndex);

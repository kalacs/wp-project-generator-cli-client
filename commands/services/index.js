import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Box, Color, render } from 'ink';
import { getConfig } from '../../services/http-client';
import createWPManagerClient from '../../services/wp-manager-client';
import Table from '../../components/Table';
import chalk from 'chalk';
import LoadingIndictor from '../../components/LoadingIndicator';

const wpManagerClient = createWPManagerClient(getConfig());

/// Get services statuses
const ServiceIndex = ({ name }) => {
	const [ isLoading, setIsLoading ] = useState();
	const [ data, setData] = useState([]);

	useEffect(() => {
		async function fetch() {
			try {
				setIsLoading(true);
				const { data } = await wpManagerClient.getProjectServicesStatuses(name)
				const result = data.map(({ names, ports: rawPorts, status: rawStatus }) => {
					const status = /Up/.test(rawStatus) ? chalk.green('●') : chalk.red('●');
					const ports = rawPorts || chalk.italic('None');
					return {
						names,
						ports,
						status
					};
				});
				setIsLoading(false);
				setData(result);
			} catch (error) {
				setIsLoading(false);
				setData(error);
			}
		}
		fetch();
	}, [name]);

	return (
		<Box flexDirection="column" width="5000">
			<LoadingIndictor isLoading={isLoading}/>
			{
				data
				?
				<Box width="100%">
					<Table data={data} />
				</Box>
				:
				<Box>
					<Text>There is no data</Text>
				</Box>
			}
		</Box>
	)
};

ServiceIndex.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default ServiceIndex;

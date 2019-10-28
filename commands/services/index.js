import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Box, Color } from 'ink';
import { getConfig } from '../../services/http-client';
import createWPManagerClient from '../../services/wp-manager-client';
import Spinner from 'ink-spinner';

const wpManagerClient = createWPManagerClient(getConfig());

/// Get services statuses
const ServiceIndex = ({ name }) => {
	const [ isLoading, setIsLoading ] = useState();
	const [ data, setData] = useState('');

	useEffect(() => {
		async function fetch() {
			try {
				setIsLoading(true);
				const { data: { out: result } } = await wpManagerClient.getProjectServicesStatuses(name)
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
		<Box flexDirection="column">
			{
				isLoading
				?
				<Box>
					<Text bold>Fetching data from server </Text>
					<Color green><Spinner type="point" /></Color>
				</Box>
				:
				<Box>
					<Text>Request completed </Text>
				</Box>
			}
			{
				data
				?
				<Box>
					<Text>{data}</Text>
				</Box>
				:
				<Box>
					<Text>''</Text>
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'ink';
import createWPManagerClient from '../../services/wp-manager-client';
import { getConfig } from '../../services/http-client';
import LoadingIndictor from '../../components/LoadingIndicator';

const wpManagerClient = createWPManagerClient(getConfig());
/// Create services
const Create = ({ name }) => {

	const [ isLoading, setIsLoading ] = useState();
	const [ response, setResponse ] = useState('');

	useEffect(() => {
		async function fetch() {
			try {
				setIsLoading(true);
				const { status } = await wpManagerClient.createProjectServices(name)
				setIsLoading(false);
				setResponse(status);
			} catch (error) {
				setIsLoading(false);
				setResponse(error);
			}
		}
		fetch();
	}, [name]);

	return (
		<Box flexDirection="column">
			<LoadingIndictor isLoading={isLoading}/>
			{
				response
				?
				<Box width="100%">
					<Text>{response}</Text>
				</Box>
				:
				<Box>
					<Text>There is no data</Text>
				</Box>
			}
		</Box>
	);
};

Create.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
};

export default Create;

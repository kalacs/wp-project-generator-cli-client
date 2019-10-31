import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Box, Color } from 'ink';
import LoadingIndicator from './LoadingIndicator';

const DisplayData = ({ data }) => (
    <Fragment>
        { data === undefined ? <Text>No data yet</Text> : <Text>{data}</Text>}        
    </Fragment>
);

const DisplayError = ({ error }) => (
    <Fragment>
        { error ? <Color red><Text>{error}</Text></Color> : <Text> </Text>}        
    </Fragment>
);

const Fetcher = ({
    beforeLoadingMessage,
    DataDisplayer = DisplayData,
    ErrorDisplayer = DisplayError,
    fetchData,
    dataMapper = data => data,
    errorHandler = error => error.toString(),
}) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ data, setData ] = useState(undefined);
    const [ error, setError ] = useState('');

	useEffect(() => {
		async function fetch() {
			try {
				setIsLoading(true);
				const response = await fetchData.call();
				setIsLoading(false);
				setData(dataMapper(response));
			} catch (error) {
                setIsLoading(false);
                setData(' ');
				setError(errorHandler(error));
			}
		}
		fetch();
	}, [fetchData]);

	return (
        <Fragment>
            <Box>
			<LoadingIndicator
                isLoading={isLoading}
                loadingMessage={beforeLoadingMessage}
            />
            </Box>
            <Box>
                <DataDisplayer data={data}/>
            </Box>
            <Box>
                <ErrorDisplayer error={error}/>
            </Box>
        </Fragment>
    );
};

Fetcher.propTypes = {
    afterLoadingMessage: PropTypes.string,
    beforeLoadingMessage: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    dataMapper: PropTypes.func,
    errorHandler: PropTypes.func
};

export default Fetcher;
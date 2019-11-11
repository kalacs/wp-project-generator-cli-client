import React, { Fragment, useState, useEffect, memo } from 'react';
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
    const [ isFetched, setIsFetched ] = useState(false); 
	const [ isLoading, setIsLoading ] = useState(false);
	const [ data, setData ] = useState();
    const [ error, setError ] = useState('');
    const onLoad = setIsLoading;

    const onData = response => {
        setIsFetched(true);
        setData(dataMapper(response));
    };

    const onError = (error) => {
        setError(errorHandler(error))
    };

    useEffect(() => {
        async function fetch() {
			try {
				onLoad(true);
				const response = await fetchData.call();
                onData(response);
				onLoad(false);
			} catch (error) {
				onLoad(false);
                onData(null);
                onError(error)
            }
        }
        if(!isFetched){
            fetch();
        }
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

export default memo(Fetcher);
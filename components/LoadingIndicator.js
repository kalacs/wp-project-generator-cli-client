import React, { Fragment } from 'react';
import { Box, Text, Color } from 'ink';
import Spinner from 'ink-spinner';

const LoadingIndictor = ({ isLoading }) => (
    <Fragment>
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
    </Fragment>
)

export default LoadingIndictor;
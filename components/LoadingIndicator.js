import React, { Fragment } from 'react';
import { Box, Text, Color } from 'ink';
import Spinner from 'ink-spinner';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ isLoading, loadingMessage = 'Fetching data from server'}) => (
    <Fragment>
        {
            isLoading
            ?
            <Box>
                <Color green><Spinner type="point" /></Color>
                <Text bold>{loadingMessage}</Text>
            </Box>
            :
            ''
        }
    </Fragment>
)

LoadingIndicator.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    loadingMessage: PropTypes.string.isRequired,
}

export default LoadingIndicator;
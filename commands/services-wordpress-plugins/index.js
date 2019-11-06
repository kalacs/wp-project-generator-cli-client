import React, { Fragment, memo, useState } from 'react';
import PropTypes from 'prop-types';
import {Text, useApp} from 'ink';
import createWPManagerClient from '../../services/wp-manager-client';
import PackageSelector from '../../components/PackageSelector';

const wpManagerClient = createWPManagerClient({
    user: 'test',
    password: 'test',
    baseURL: 'http://127.0.0.1:3000',
    logger: {
		trace: () => {},
		info: () => {},
		error: () => {}
	}
})

/// Wordpress commands
const Index = () => {
    const [packageName, setPackageName] = useState();
    const { exit } = useApp();

    return (
        <Fragment>
            <PackageSelector
                onSelect={setPackageName}
                onSubmit={exit}
            />
        </Fragment>
    );
};

export default memo(Index);

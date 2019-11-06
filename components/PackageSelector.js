import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DynamicSelect from './DynamicSelect';
import createWPManagerClient from '../services/wp-manager-client';

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
const PackageSelector = ({ onSelect, onSubmit }) => {
    return (
            <DynamicSelect 
                label='Select from predefined package'
                selectProps={{
                    onSubmit,
                    onFocus: onSelect,
                    onChange: onSelect,
                    name: 'package'
                }}
                hookProps={{
                    fetchData: wpManagerClient.getWordpressPackages.bind(null, 'bela')
                }}
                toItems={data => {
                    return Object.keys(data).map(item => ({ label: item.toUpperCase(), value: item }));
                }}
            />
    );
};

export default memo(PackageSelector);

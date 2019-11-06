import React, { Fragment, useEffect, useState, memo } from 'react';
import { Text, Color, Box } from 'ink';
import SelectInput from './SelectInput';
import fetchHook from '../utils/hooks/fetch';

const DynamicSelect = ({
    label,
    selectProps,
    hookProps,
    toItems = () => []
}) => {
    const {
        onSuccess = () => {},
        onLoad = () => {},
        onFailed = () => {},
        fetchData = () => {},
    } = hookProps;
    const [items, setItems] = useState([]);

    useEffect(fetchHook({
        onSuccess: ({ data }) => setItems(toItems(data)),
        onLoad,
        onFailed: error => console.log('ERROR', error),
        fetchData
    }), []);

    return (
        <Fragment>
            <Text bold>{label}</Text>
            <SelectInput {...selectProps} items={items} />
        </Fragment>
    );
};

export default memo(DynamicSelect);
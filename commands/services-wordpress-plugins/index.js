import React, { memo, useEffect, Fragment } from 'react'
import { Form, FormSpy } from 'react-final-form'
import { Box } from 'ink'
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput, createSelectInput, createMultiSelectInput } from '../../utils/factories/field-creators';
import FormField from '../../components/FormField';
import fetchHook from '../../utils/hooks/fetch';
import setFieldData from 'final-form-set-field-data';

const wpManagerClient = createWPManagerClient({
    user: 'test',
    password: 'test',
    baseURL: 'http://127.0.0.1:3000',
    logger: {
		trace: () => {},
		info: () => {},
		error: () => {}
	}
});
const isRequired = value => !value ? 'Required' : undefined; 
const noFormatNoPlaceholderRequired = (name, label) => [name, label, '', undefined, isRequired];

const getPackage = name => data => data[name];
const transformForPackage = data => ({ items: Object.keys(data).map(item => ({ label: item.toUpperCase(), value: item })) });
const transformForContent = contentType => data => contentType in data && data[contentType] ? data[contentType].map(item => ({ label: item.name, value: item.path })) : []

/// Install generated and started wordpress
const Install = ({ initialValues, onData }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()
	const [packageData, setPackageData] = React.useState({ })
    const [packages, setPackages] = React.useState({ items: []})
    const [plugins, setPlugins] = React.useState({ items: []})
    const [themes, setThemes ] = React.useState({ items: []})

    useEffect(fetchHook({
        onSuccess: (response) => {
            if (response) {
                setPackageData(response.data);
                setPackages(transformForPackage(response.data));
            }            
        },
        onFailed: error => console.log('ERROR', error),
        fetchData: wpManagerClient.getWordpressPackages,
        onLoad: () => {}
    }), []);
    const fields = [
        createSelectInput('package','Package', packages),
        createMultiSelectInput('plugins', 'Plugins'),
        createSelectInput('theme','Theme', themes),
    ];
    return (
        <Fragment>
        {
            !submission ?
            <Form
                onSubmit={setSubmission}
                initialValues={initialValues}
                mutators={{ setFieldData }}
            >
                {({ handleSubmit, validating, form }) => {
                    const packageState = form.getFieldState('package');
                    const selectedPackage = packageState && 'value' in packageState ? packageState.value : '';

                    if(selectedPackage) {
                        form.mutators.setFieldData('plugins', { inputConfig: { items: transformForContent('plugins')(getPackage(selectedPackage)(packageData))}});
                        form.mutators.setFieldData('theme', { inputConfig: { items: transformForContent('themes')(getPackage(selectedPackage)(packageData))}});
                    }

                    return (
                        <Box flexDirection="column">
                            {fields.map((
                                {
                                    name,
                                    label,
                                    placeholder,
                                    format,
                                    validate,
                                    Input,
                                    inputConfig,
                                },
                                index
                            ) => (<FormField key={name} {...{
                                name,
                                label,
                                placeholder,
                                format,
                                validate,
                                Input,
                                inputConfig,
                                isActive: activeField === index,
                                onSubmit: ({ meta, input }) => {
                                    if (meta.valid && !validating) {
                                        setActiveField(value => value + 1) // go to next field
                                        if (activeField === fields.length - 1) {
                                            // last field, so submit
                                            handleSubmit()
                                        }
                                    } else {
                                        input.onBlur() // mark as touched to show error
                                    }
                                }
                            }} />))}
                        </Box>
                    );
                }}
            </Form> : 
            JSON.stringify(submission)
        }

    </Fragment>

	)
}
export default memo(Install);
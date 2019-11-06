import React, { memo } from 'react'
import { Form } from 'react-final-form'
import { Box,Text } from 'ink'
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput, createMultiSelectInput } from '../../utils/factories/field-creators';
import FormField from '../../components/FormField';
import Fetcher from '../../components/Fetcher';

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
const fields = [
	createTextInput(...noFormatNoPlaceholderRequired('projectPrefix', 'Project name')),
	createMultiSelectInput('plugins', 'Plugins',{items: [
		{
			label: 'Safe SVG',
			value: 'safe-svg'	
		},
		{
			label: 'W3 Total cache',
			value: 'w3-total-cache'	
		},
		{
			label: 'Classic editor',
			value: 'classic-editor'	
		},
	]})
]

/// Install generated and started wordpress
const InstallPlugins = ({ initialValues, onData = () => {} }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()

	const beforeSubmission = (submission) => {
		setSubmission(Object.assign({}, submission, {
			container: `${submission.projectPrefix}-wordpress`,
			network: `${submission.projectPrefix}-wp-network`
		}))
	}

	return (
		<Form onSubmit={beforeSubmission} initialValues={initialValues}>
			{({ handleSubmit, validating }) => (
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
						onSubmit: ({ meta, input}) => {
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
					{
						submission
						?
						<Fetcher
							fetchData={wpManagerClient.installWordpressPlugins.bind(null, submission)}
							beforeLoadingMessage={`Installing Plugins`}
							dataMapper={(response) => {
								onData(submission);
								return response && response.status === 200 ? 'Plugins installed!':'Something went wrong';
							}}
						/>
						:
						''
					}
				</Box>
			)}
		</Form>
	)
}
export default memo(InstallPlugins);
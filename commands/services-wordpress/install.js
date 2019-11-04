import React, { memo } from 'react'
import { Form } from 'react-final-form'
import { Box } from 'ink'
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput } from '../../utils/factories/field-creators';
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
	createTextInput(...noFormatNoPlaceholderRequired('container', 'Container name')),
	createTextInput(...noFormatNoPlaceholderRequired('network', 'Network name')),
	createTextInput(...noFormatNoPlaceholderRequired('url', 'WP Url')),
	createTextInput(...noFormatNoPlaceholderRequired('title', 'Title')),
	createTextInput(...noFormatNoPlaceholderRequired('adminName', 'Admin name')),
	createTextInput(...noFormatNoPlaceholderRequired('adminPassword', 'Admin password')),
	createTextInput(...noFormatNoPlaceholderRequired('adminEmail', 'Admin email')),
]

/// Install generated and started wordpress
const Install = ({ initialValues, onData }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()

	return (
		<Form onSubmit={setSubmission} initialValues={initialValues}>
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
							fetchData={wpManagerClient.installProjectServiceWordpress.bind(null, submission)}
							beforeLoadingMessage={`Installing WP`}
							dataMapper={(response) => {
								onData(submission);
								return response && response.status === 200 ? 'Worpress installed!':'Something went wrong';
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
export default memo(Install);
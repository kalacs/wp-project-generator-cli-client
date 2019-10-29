import React, { Fragment } from 'react'
import { Form } from 'react-final-form'
import { Box,Text } from 'ink'
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput } from '../../utils/factories/field-creators';
import FormField from '../../components/FormField';
import LoadingIndictor from '../../components/LoadingIndicator';

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
const Install = () => {
	const [activeField, setActiveField] = React.useState(0)
	const [status, setStatus] = React.useState(0)
	const [isLoading, setIsLoading] = React.useState(false)
	const [isSubmitted, setIsSubmitted] = React.useState(false)

	return (
		<Form onSubmit={async params => {
			setIsSubmitted(true)
			setIsLoading(true);
			const { status } = await wpManagerClient.installProjectServiceWordpress(params);
			setIsLoading(false);
			setStatus(status);
		}}>
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
						isSubmitted
						?
						<Fragment>
							<LoadingIndictor isLoading={isLoading}/>
							{
								status
								?
								<Box width="100%">
									<Text>{status}</Text>
								</Box>
								:
								<Box>
									<Text>No response yet</Text>
								</Box>
							}
						</Fragment>
						:
						''
					}
				</Box>
			)}
		</Form>
	)
}
export default Install;
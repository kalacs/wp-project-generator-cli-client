import React from 'react'
import { Form } from 'react-final-form'
import { Box, Color } from 'ink'
import Spinner from 'ink-spinner'
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput } from '../../utils/factories/field-creators';
import FormField from '../../components/FormField';

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

const fields = [
	createTextInput(
		'project.prefix',
		'Project prefix',
		'my-awesome-project',
		value => value ? value
							.toLowerCase()
							.replace(/[^a-z \\-]/g, '')
							.replace(/ /g, '-')
						: '',
		value => !value ? 'Require' : undefined
	),
	createTextInput(
		'project.path',
		'Project path',
		'/home/user/localSites',
		value => value ? value
							.toLowerCase()
							.replace(/[^a-z \\-]/g, '')
							.replace(/ /g, '-')
						: '',
		value => !value ? 'Require' : undefined
	),
	createTextInput('project.database.name', 'Database name'),
	createTextInput('project.database.user', 'Database user'),
	createTextInput('project.database.password', 'Database password'),
	createTextInput('project.database.rootPassword', 'Database root password'),
	createTextInput('project.webserver.port', 'Webserver port'),
]

/// CliForm
const CliForm = () => {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()
	const [isLoading, setIsLoading] = React.useState(false)

	return (
		<Form onSubmit={async params => {
			setIsLoading(true);
			await wpManagerClient.createWordpressProject(params);
			setSubmission(params);
			setIsLoading(false);
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
				{submission ? (isLoading ? 	<Box marginLeft={1}><Color yellow><Spinner type="dots" /></Color></Box>  : 'Sent to server'):''}
				</Box>
			)}
		</Form>
	)
}
export default CliForm;
import React, { memo } from 'react'
import { Form } from 'react-final-form'
import { Box } from 'ink'
import Fetcher from '../../components/Fetcher';
import createWPManagerClient from '../../services/wp-manager-client';
import { createTextInput } from '../../utils/factories/field-creators';
import FormField from '../../components/FormField';
import { getConfig } from '../../services/http-client';

const wpManagerClient = createWPManagerClient(getConfig());
const isRequired = value => !value ? 'Required' : undefi0ned; 

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
		isRequired
	),
	createTextInput('project.database.name', 'Database name', '', undefined, isRequired),
	createTextInput('project.database.user', 'Database user', '', undefined, isRequired),
	createTextInput('project.database.password', 'Database password', '', undefined, isRequired),
	createTextInput('project.database.rootPassword', 'Database root password', '', undefined, isRequired),
	createTextInput('project.webserver.port', 'Webserver port', '', undefined, isRequired),
]

/// Generate new wordpress project from template
const Generate = ({ onData }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()

	return (
		<Box flexDirection="column">
			<Form onSubmit={setSubmission}>
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
					</Box>
				)}
			</Form>
			{
				submission
				?
				<Fetcher
					fetchData={wpManagerClient.createWordpressProject.bind(null, submission)}
					beforeLoadingMessage={`Generating project: "${submission.project.prefix}"`}
					dataMapper={(response) => {
						onData(submission);
						return response && response.status === 200 ? 'Project structure has been created':'Something went wrong';
					}}
				/>
				:
				''
			}
		</Box>
	)
}
export default memo(Generate);
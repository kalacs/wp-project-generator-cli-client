import React from 'react'
import { Form, Field } from 'react-final-form'
import { Box, Color, Text } from 'ink'
import TextInput from '../../components/TextInput'
import SelectInput from '../../components/SelectInput'
import MultiSelectInput from '../../components/MultiSelectInput'
import Error from '../../components/Error'
import Spinner from 'ink-spinner'
import createWPManagerClient from '../../services/wp-manager-client';

const wpManagerClient = createWPManagerClient({
    user: 'test',
    password: 'test',
    baseURL: 'http://127.0.0.1:3000',
    logger: {
		trace: console.log,
		info: console.log,
		error: console.error
	}
  });

const createTextInput = (name, label, placeholder = '', format = value => value || '', validate = () => undefined) => ({
	name,
	label,
	placeholder,
	format,
	validate,
	Input: TextInput
})

const createSelectInput = (name, label, inputConfig, format = value => value || '', validate = () => undefined) => ({
	name,
	label,
	inputConfig,
	format,
	validate,
	Input: SelectInput
})

const createMultiSelectInput = (name, label, inputConfig, format = value => value, validate = undefined) => ({
	name,
	label,
	inputConfig,
	format,
	validate,
	Input: MultiSelectInput
})

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
					{fields.map(
						(
							{
								name,
								label,
								placeholder,
								format,
								validate,
								Input,
								inputConfig
							},
							index
						) => (
							<Field name={name} key={name} format={format} validate={validate}>
								{({ input, meta }) => (
									<Box flexDirection="column">
										<Box>
											<Text bold={activeField === index}>{label}: </Text>
											{activeField === index ? (
												<Input
													{...input}
													{...inputConfig}
													placeholder={placeholder}
													onSubmit={() => {
														if (meta.valid && !validating) {
															setActiveField(value => value + 1) // go to next field
															if (activeField === fields.length - 1) {
																// last field, so submit
																handleSubmit()
															}
														} else {
															input.onBlur() // mark as touched to show error
														}
													}}
												/>
											) : (
												(input.value && <Text>{input.value}</Text>) ||
												(placeholder && <Color gray>{placeholder}</Color>)
											)}
											{validating && name === 'name' && (
												<Box marginLeft={1}>
													<Color yellow>
														<Spinner type="dots" />
													</Color>
												</Box>
											)}
											{meta.invalid && meta.touched && (
												<Box marginLeft={2}>
													<Color red>✖</Color>
												</Box>
											)}
											{meta.valid && meta.touched && meta.inactive && (
												<Box marginLeft={2}>
													<Color green>✔</Color>
												</Box>
											)}
										</Box>
										{meta.error && meta.touched && <Error>{meta.error}</Error>}
									</Box>
								)}
							</Field>
						)
					)}
				{submission ? (isLoading ? 	<Box marginLeft={1}><Color yellow><Spinner type="dots" /></Color></Box>  : 'Sent to server'):''}
				</Box>
			)}
		</Form>
	)
}
export default CliForm;
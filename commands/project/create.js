import React from 'react'
import { Form, Field } from 'react-final-form'
import { AppContext, Box, Color, Text } from 'ink'
import TextInput from '../../components/TextInput'
import SelectInput from '../../components/SelectInput'
import MultiSelectInput from '../../components/MultiSelectInput'
import Error from '../../components/Error'
import Spinner from 'ink-spinner'

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
		'prefix',
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
		'path',
		'Project path',
		'/home/user/localSites',
		value => value ? value
							.toLowerCase()
							.replace(/[^a-z \\-]/g, '')
							.replace(/ /g, '-')
						: '',
		value => !value ? 'Require' : undefined
	),
	createTextInput('databaseName', 'Database name'),
	createTextInput('databaseUser', 'Database user'),
	createTextInput('databasePassword', 'Database password'),
	createTextInput('databaseRootPassword', 'Database root password'),
	createTextInput('webserverPort', 'Webserver port'),
	createSelectInput('language', 'Language', {
		items: [
			{ label: 'Javascript', value: 'javascript' },
			{ label: 'Typescript', value: 'typescript' }
		]
	}),
	createMultiSelectInput('techno', 'Technolo', {
		items: [
			{ label: '⚛️ React', value: 'react' },
			{ label: 'Angular', value: 'angular' },
			{ label: 'Redux', value: 'redux' },
			{ label: 'GraphQL', value: 'graphql' },
			{ label: '🏁 React-Final-Form', value: 'react-final-form' },
			{ label: '💅 Styled Components', value: 'styled-components' },
			{ label: '👨‍🎤 Emotion', value: 'emotion' },
			{ label: '🌈‍ Ink', value: 'ink' }
		]
	}),
]

/// CliForm
export default function CliForm() {
	const [activeField, setActiveField] = React.useState(0)
	const [submission, setSubmission] = React.useState()
	return submission ? (
		<AppContext.Consumer>
			{({ exit }) => {
				setTimeout(exit)
				return (
					<Box flexDirection="column" marginTop={1}>
						<Color blue>
							<Text bold>Values submitted:</Text>
						</Color>
						<Box>{JSON.stringify(submission, undefined, 2)}</Box>
					</Box>
				)
			}}
		</AppContext.Consumer>
	) : (
		<Form onSubmit={setSubmission}>
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
				</Box>
			)}
		</Form>
	)
}
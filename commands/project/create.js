import React, { memo, useEffect, useState } from "react"
import { Form } from "react-final-form"
import { Box } from "ink"
import createWPManagerClient from "../../services/wp-manager-client"
import { createTextInput } from "../../utils/factories/field-creators"
import FormField from "../../components/FormField"
import { getConfig } from "../../services/http-client"
import FetchHandler from "../../components/FetchHandler"
import useDataAPI from "../../utils/hooks/data-api"
const wpManagerClient = createWPManagerClient(getConfig())
const isRequired = (value) => (!value ? "Required" : undefined)

const fields = [
	createTextInput(
		"project.prefix",
		"Project prefix",
		"my-awesome-project",
		(value) =>
			value
				? value
						.toLowerCase()
						.replace(/[^a-z \\-]/g, "")
						.replace(/ /g, "-")
				: "",
		isRequired
	),
	createTextInput(
		"project.database.name",
		"Database name",
		"",
		undefined,
		isRequired
	),
	createTextInput(
		"project.database.user",
		"Database user",
		"",
		undefined,
		isRequired
	),
	createTextInput(
		"project.database.password",
		"Database password",
		"",
		undefined,
		isRequired
	),
	createTextInput(
		"project.database.rootPassword",
		"Database root password",
		"",
		undefined,
		isRequired
	),
	createTextInput(
		"project.webserver.port",
		"Webserver port",
		"",
		undefined,
		isRequired
	)
]

/// Generate new wordpress project from template
const Generate = ({ onData = () => {} }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [formData, setFormData] = useState()
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()

	return (
		<Box flexDirection="column">
			<Form
				onSubmit={(data) => {
					setFormData(data)
					setFetcher(() => wpManagerClient.createWordpressProject.bind(null, data))
					onData(data)
				}}
			>
				{({ handleSubmit, validating }) => (
					<Box flexDirection="column">
						{fields.map(
							(
								{ name, label, placeholder, format, validate, Input, inputConfig },
								index
							) => (
								<FormField
									key={name}
									{...{
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
												setActiveField((value) => value + 1) // go to next field
												if (activeField === fields.length - 1) {
													// last field, so submit
													handleSubmit()
												}
											} else {
												input.onBlur() // mark as touched to show error
											}
										}
									}}
								/>
							)
						)}
					</Box>
				)}
			</Form>
			{formData ? (
				<FetchHandler
					onErrorMessage="Something went wrong"
					onLoadMessage={`Generating project: "${formData.project.prefix}"`}
					onSuccessMessage="Project structure has been created."
					isLoading={isLoading}
					hasBeenLoaded={data || error}
					hasError={error !== null}
				/>
			) : (
				""
			)}
		</Box>
	)
}
export default memo(Generate)

import React, { memo, useState } from "react"
import { Form } from "react-final-form"
import { Box } from "ink"
import createWPManagerClient from "../../services/wp-manager-client"
import { createTextInput } from "../../utils/factories/field-creators"
import FormField from "../../components/FormField"
import { getConfig } from "../../services/http-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"

const wpManagerClient = createWPManagerClient(getConfig())
const isRequired = (value) => (!value ? "Required" : undefined)
const noFormatNoPlaceholderRequired = (name, label) => [
	name,
	label,
	"",
	undefined,
	isRequired
]

/// Install generated and started wordpress
const Install = ({
	initialValues = {},
	onSuccess = () => null,
	onError = () => null
}) => {
	const [activeField, setActiveField] = React.useState(0)
	const [formData, setFormData] = useState()
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()

	if (data && data.status === 200) {
		onSuccess(data)
	} else {
		onError(data)
	}

	if (error) {
		onError(error)
	}

	const fieldConfig = {
		projectPrefix: createTextInput(...noFormatNoPlaceholderRequired("projectPrefix", "Project name")),
		container: createTextInput(...noFormatNoPlaceholderRequired("container", "Container name")),
		network: createTextInput(...noFormatNoPlaceholderRequired("network", "Network name")),
		url: createTextInput(...noFormatNoPlaceholderRequired("url", "WP Url")),
		title: createTextInput(...noFormatNoPlaceholderRequired("title", "Title")),
		adminName: createTextInput(...noFormatNoPlaceholderRequired("adminName", "Admin name")),
		adminPassword: createTextInput(
			...noFormatNoPlaceholderRequired("adminPassword", "Admin password")
		),
		adminEmail: createTextInput(...noFormatNoPlaceholderRequired("adminEmail", "Admin email"))
	}
	const initialValuesProperties = Object.keys(initialValues);
	const fields = initialValuesProperties.length > 0 ? Object.entries(fieldConfig).filter(([fieldName, field]) => {
		return initialValuesProperties.includes(fieldName) ? null : field;
	}).map(([,field]) => field) : Object.values(fieldConfig);

	return (
		<Form
			onSubmit={(data) => {
				setFormData(data)
				setFetcher(() =>
					wpManagerClient.installProjectServiceWordpress.bind(null, data)
				)
			}}
			initialValues={initialValues}
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
					{formData ? (
						<FetchHandler
							onErrorMessage="Something went wrong"
							onLoadMessage={`Installing WP`}
							onSuccessMessage="Worpress installed."
							isLoading={isLoading}
							hasBeenLoaded={data || error}
							hasError={error !== null}
						/>
					) : (
						""
					)}
				</Box>
			)}
		</Form>
	)
}
export default memo(Install)

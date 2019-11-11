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
const fields = [
	createTextInput(...noFormatNoPlaceholderRequired("projectPrefix", "Project name")),
	createTextInput(...noFormatNoPlaceholderRequired("container", "Container name")),
	createTextInput(...noFormatNoPlaceholderRequired("network", "Network name")),
	createTextInput(...noFormatNoPlaceholderRequired("url", "WP Url")),
	createTextInput(...noFormatNoPlaceholderRequired("title", "Title")),
	createTextInput(...noFormatNoPlaceholderRequired("adminName", "Admin name")),
	createTextInput(
		...noFormatNoPlaceholderRequired("adminPassword", "Admin password")
	),
	createTextInput(...noFormatNoPlaceholderRequired("adminEmail", "Admin email"))
]

/// Install generated and started wordpress
const Install = ({ initialValues = {}, onData = () => {} }) => {
	const [activeField, setActiveField] = React.useState(0)
	const [formData, setFormData] = useState()
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()

	return (
		<Form
			onSubmit={(data) => {
				setFormData(data)
				setFetcher(() =>
					wpManagerClient.installProjectServiceWordpress.bind(null, data)
				)
				onData(data)
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

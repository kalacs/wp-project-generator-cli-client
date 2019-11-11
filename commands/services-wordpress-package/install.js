import React, { memo, Fragment, useEffect, useState } from "react"
import { Form } from "react-final-form"
import { Box } from "ink"
import createWPManagerClient from "../../services/wp-manager-client"
import {
	createTextInput,
	createMultiSelectInput,
	createSelectInput
} from "../../utils/factories/field-creators"
import FormField from "../../components/FormField"
import Fetcher from "../../components/Fetcher"
import { getConfig } from "../../services/http-client"
import setFieldData from "final-form-set-field-data"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"

const wpManagerClient = createWPManagerClient(getConfig())
const getPackage = (name) => (data) => data[name]
const transformForPackage = (data) => ({
	items: Object.keys(data).map((item) => ({
		label: item.toUpperCase(),
		value: item
	}))
})
const transformForContent = (contentType) => (data) =>
	contentType in data && data[contentType]
		? data[contentType].map((item) => ({ label: item.name, value: item.path }))
		: []

/// Install generated and started wordpress
const InstallPackage = ({ projectName, initialValues = {}, onData = () => {} }) => {
	const [activeField, setActiveField] = useState(0)
	const [submission, setSubmission] = useState()
	const [packages, setPackages] = useState({ items: [] })
	const [
		{ data: packageData, error: packageDataError, isLoading: packageDataIsLoading },
		setFetcher
	] = useDataAPI()
	const [
		{ data: pluginData, error: pluginError, isLoading: pluginIsLoading },
		submitPlugin
	] = useDataAPI()
	const [
		{ data: themeData, error: themeError, isLoading: themeIsLoading },
		submitTheme
	] = useDataAPI()

	useEffect(() => {
		setFetcher(() => wpManagerClient.getWordpressPackages)
	}, [])

	const beforeSubmission = (formData) => {
		const submission = Object.assign({}, formData, {
			container: `${formData.projectName}-wordpress`,
			network: `${formData.projectName}-wp-network`,
			projectPrefix: formData.projectName
		})
		setSubmission(submission)
		submitPlugin(() =>
			wpManagerClient.installWordpressPlugins.bind(null, submission)
		)
		submitTheme(() => wpManagerClient.installWordpressTheme.bind(null, submission))
	}

	const fields = [
		createTextInput("projectName", "Project name"),
		createSelectInput("package", "Package", packages),
		createMultiSelectInput("plugins", "Plugins"),
		createSelectInput("theme", "Theme")
	]

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage="Get packages from server ..."
				onSuccessMessage="Request done"
				isLoading={packageDataIsLoading}
				hasBeenLoaded={packageData || packageDataError}
				hasError={packageDataError !== null}
			/>
			<Form
				onSubmit={beforeSubmission}
				initialValues={initialValues}
				mutators={{ setFieldData }}
			>
				{({ handleSubmit, validating, form }) => {
					const packageState = form.getFieldState("package")
					const selectedPackage =
						packageState && "value" in packageState ? packageState.value : ""

					if (packageData) {
						form.mutators.setFieldData("package", {
							inputConfig: transformForPackage(packageData)
						})
					}

					if (selectedPackage) {
						form.mutators.setFieldData("plugins", {
							inputConfig: {
								items: transformForContent("plugins")(
									getPackage(selectedPackage)(packageData)
								)
							}
						})
						form.mutators.setFieldData("theme", {
							inputConfig: {
								items: transformForContent("themes")(
									getPackage(selectedPackage)(packageData)
								)
							}
						})
					}

					return (
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
							{submission ? (
								<Fragment>
									<FetchHandler
										onErrorMessage="Something went wrong"
										onLoadMessage="`Installing plugins`"
										onSuccessMessage="Plugins installed"
										isLoading={pluginIsLoading}
										hasBeenLoaded={pluginData || pluginError}
										hasError={pluginError !== null}
									/>
									<FetchHandler
										onErrorMessage="Something went wrong"
										onLoadMessage="`Installing theme`"
										onSuccessMessage="Theme installed"
										isLoading={themeIsLoading}
										hasBeenLoaded={themeData || themeError}
										hasError={themeError !== null}
									/>
								</Fragment>
							) : (
								""
							)}
						</Box>
					)
				}}
			</Form>
		</Fragment>
	)
}
export default memo(InstallPackage)

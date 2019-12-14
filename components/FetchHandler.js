import React, { Fragment } from "react"
import { Text, Color } from "ink"
import LoadingIndicator from "./LoadingIndicator"

const FetchHandler = ({
	onLoadMessage,
	onSuccessMessage,
	onErrorMessage,
	hasError = false,
	hasBeenLoaded = false,
	isLoading = false
}) => {
	return (
		<Fragment>
			{!hasBeenLoaded ? (
				<LoadingIndicator isLoading={isLoading} loadingMessage={onLoadMessage} />
			) : hasError ? (
				<Text>
					<Color red>✖{' '}{onErrorMessage}</Color>
				</Text>
			) : (
				<Text>
					<Color green>✔{' '}{onSuccessMessage}</Color>
				</Text>
			)}
		</Fragment>
	)
}

export default FetchHandler

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
					<Color red>✖ </Color>{onErrorMessage}
				</Text>
			) : (
				<Text>
					<Color green>✔ </Color>{onSuccessMessage}
				</Text>
			)}
		</Fragment>
	)
}

export default FetchHandler

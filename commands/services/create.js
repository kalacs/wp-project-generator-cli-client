import React, { memo, useEffect, Fragment } from "react"
import PropTypes from "prop-types"
import createWPManagerClient from "../../services/wp-manager-client"
import { getConfig } from "../../services/http-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"

const wpManagerClient = createWPManagerClient(getConfig())
/// Create services
const Create = ({ name, onSuccess = () => null, onError = () => null }) => {
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.createProjectServices.bind(null, name))
	}, [])

	if (data && data.status === 200) {
		onSuccess(data)
	} else {
		onError(data)
	}

	if (error) {
		onError(error)
	}

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage={`Start "${name}" project's services `}
				onSuccessMessage="Services have been created."
				isLoading={isLoading}
				hasBeenLoaded={data || error}
				hasError={error !== null}
			/>
		</Fragment>
	)
}

Create.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
}

export default memo(Create)

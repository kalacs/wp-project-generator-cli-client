import React, { useEffect, Fragment } from "react"
import PropTypes from "prop-types"
import { getConfig } from "../../services/http-client"
import createWPManagerClient from "../../services/wp-manager-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"
const wpManagerClient = createWPManagerClient(getConfig())

/// Stop services
const ServiceStop = ({ name }) => {
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.stopProjectServices.bind(null, name))
	}, [])

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage={`Stop "${name}" project's services `}
				onSuccessMessage="Services have been stopped."
				isLoading={isLoading}
				hasBeenLoaded={!!(data || error)}
				hasError={error !== null}
			/>
		</Fragment>
	)
}

ServiceStop.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
}

export default ServiceStop

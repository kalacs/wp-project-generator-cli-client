import React, { useEffect, Fragment } from "react"
import PropTypes from "prop-types"
import { getConfig } from "../../services/http-client"
import createWPManagerClient from "../../services/wp-manager-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"
const wpManagerClient = createWPManagerClient(getConfig())

/// Start services
const ServiceStart = ({ name }) => {
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.startProjectServices.bind(null, name))
	}, [])

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage={`Start "${name}" project's services `}
				onSuccessMessage="Services have been started."
				isLoading={isLoading}
				hasBeenLoaded={data || error}
				hasError={error !== null}
			/>
		</Fragment>
	)
}

ServiceStart.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
}

export default ServiceStart

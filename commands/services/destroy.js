import React, { useEffect, Fragment } from "react"
import PropTypes from "prop-types"
import createWPManagerClient from "../../services/wp-manager-client"
import { getConfig } from "../../services/http-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"

const wpManagerClient = createWPManagerClient(getConfig())
/// Destroy services
const Destroy = ({ name }) => {
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.destroyProjectServices.bind(null, name))
	}, [])

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage={`Destroy "${name}" project's services `}
				onSuccessMessage="Services have been downed."
				isLoading={isLoading}
				hasBeenLoaded={data || error}
				hasError={error !== null}
			/>
		</Fragment>
	)
}

Destroy.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
}

export default Destroy

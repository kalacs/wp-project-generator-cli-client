import React, { memo, Fragment, useEffect, useState } from "react"
import createWPManagerClient from "../../services/wp-manager-client"
import { getConfig } from "../../services/http-client"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"

const Test = () => {
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.getWordpressPackages)
	}, [])

	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage="Get packages from server ..."
				onSuccessMessage="Request done"
				isLoading={isLoading}
				hasBeenLoaded={data || error}
				hasError={error !== null}
			/>
		</Fragment>
	)
}

const wpManagerClient = createWPManagerClient(getConfig())
/// Install generated and started wordpress
const Index = () => {
	return <Test />
}
export default memo(Index)

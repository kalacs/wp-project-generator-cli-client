import React, { useState, useEffect, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { getConfig } from "../../services/http-client"
import createWPManagerClient from "../../services/wp-manager-client"
import Table from "../../components/Table"
import chalk from "chalk"
import useDataAPI from "../../utils/hooks/data-api"
import FetchHandler from "../../components/FetchHandler"
const wpManagerClient = createWPManagerClient(getConfig())
/// Get services statuses
const ServiceIndex = ({ name }) => {
	let rows = []
	const [{ data, error, isLoading }, setFetcher] = useDataAPI()
	useEffect(() => {
		setFetcher(() => wpManagerClient.getProjectServicesStatuses.bind(null, name))
	}, [])
	return (
		<Fragment>
			<FetchHandler
				onErrorMessage="Something went wrong"
				onLoadMessage={`Get ${name} project's statuses...`}
				onSuccessMessage="Rows fetched"
				isLoading={isLoading}
				hasBeenLoaded={!!(data || error)}
				hasError={error !== null}
			/>
			{data ? (
				<Table
					data={
						Array.isArray(data.data)
							? data.data.map(({ names, ports: rawPorts, status: rawStatus }) => {
									const status = /Up/.test(rawStatus)
										? chalk.green("●")
										: chalk.red("●")
									const ports = rawPorts || chalk.italic("None")
									return {
										names,
										ports,
										status
									}
							  })
							: []
					}
				/>
			) : (
				""
			)}
		</Fragment>
	)
}

ServiceIndex.propTypes = {
	/// Name of the project
	name: PropTypes.string.isRequired
}

export default memo(ServiceIndex)

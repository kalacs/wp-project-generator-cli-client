import React, { useState, Fragment } from "react"
import { Box, Color, Text } from "ink"
import Generate from "./create"
import Create from "../services/create"
import InstallWP from "../services-wordpress/install"
import Link from "ink-link"
import Divider from "ink-divider"
import InstallPackage from "../services-wordpress-package/install"
const getName = (data) => data.project.prefix

/// Kickstart project
const ProjectKickstart = () => {
	const [firstTaskSuccess, setFirstTaskSuccess] = useState()
	const [firstTaskError, setFirstTaskError] = useState()
	const [secondTaskSuccess, setSecondTaskSuccess] = useState()
	const [secondTaskError, setSecondTaskError] = useState()
	const [thirdTaskSuccess, setThirdTaskSuccess] = useState()
	const [thirdTaskError, setThirdTaskError] = useState()
	const [fourthTaskSuccess, setFourthTaskSuccess] = useState()
	const [fourthTaskError, setFourthTaskError] = useState()

	const getInitialValues = ({
		project: {
			prefix: projectPrefix,
		}
	}) => ({
		projectPrefix,
		container: `${projectPrefix}-wordpress`,
		network: `${projectPrefix}-wp-network`,
		url: `${projectPrefix}.localhost`
	})

	return (
		<Box flexDirection="column">
			<Box paddingTop={1} paddingBottom={1}>
				<Divider title="1/4. Docker service settings" />
			</Box>
			<Generate onSuccess={setFirstTaskSuccess} onError={setFirstTaskError} />
			{firstTaskSuccess ? (
				<Fragment>
					<Box paddingTop={1} paddingBottom={1}>
						<Divider title="2/4. Initialize docker services" />
					</Box>
					<Create
						name={getName(firstTaskSuccess)}
						onSuccess={setSecondTaskSuccess}
						onError={setSecondTaskError}
					/>
				</Fragment>
			) : (
				""
			)}
			{secondTaskSuccess ? (
				<Fragment>
					<Box paddingTop={1} paddingBottom={1}>
						<Divider title="3/4. Wordpress settings" />
					</Box>
					<InstallWP
						initialValues={getInitialValues(firstTaskSuccess)}
						onSuccess={setThirdTaskSuccess}
						onError={setThirdTaskError}
					/>
				</Fragment>
			) : (
				""
			)}
			{thirdTaskSuccess ? (
				<Fragment>
					<Box paddingTop={1} paddingBottom={1}>
						<Divider title="4/4. Install plugins and themes" />
					</Box>
					<InstallPackage
						initialValues={getInitialValues(firstTaskSuccess)}
						onSuccess={setThirdTaskSuccess}
						onError={setThirdTaskError}
					/>
				</Fragment>
			) : (
				""
			)}
			{fourthTaskSuccess ? (
				<Box paddingTop={1} paddingBottom={1}>
					<Link url={`http://${thirdTaskSuccess.url}`}>
						<Color green>Open wordpress site</Color>
					</Link>
				</Box>
			) : (
				""
			)}
		</Box>
	)
}

export default ProjectKickstart

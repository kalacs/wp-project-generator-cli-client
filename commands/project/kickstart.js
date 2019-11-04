import React, { useState } from 'react';
import { Box, Color } from 'ink';
import Generate from './create';
import Create from '../services/create';
import Install from '../services-wordpress/install';
import Link from 'ink-link';

const getName = data => data.project.prefix;

/// Kickstart project
const ProjectKickstart = () => {
    const [ firstTaskData, setFirstTaskData ] = useState();
    const [ secondTaskData, setSecondTaskData ] = useState();
    const [ thirdTaskData, setThirdTaskData ] = useState();

    const getInitialValues = ({ project: { prefix: projectPrefix, webserver: { port } } }) => ({
        projectPrefix,
        container: `${projectPrefix}-wordpress`,
        network: `${projectPrefix}-wp-network`,
        url: `0.0.0.0:${port}`
    });

    return (
        <Box flexDirection="column">
            <Generate onData={setFirstTaskData} />
            {
                firstTaskData || secondTaskData ?
                <Create
                    name={getName(firstTaskData)}
                    onData={setSecondTaskData}
                /> :
                ''
            }
            {
                secondTaskData ?
                <Install
                    initialValues={getInitialValues(firstTaskData)}
                    onData={setThirdTaskData}
                /> :
                ''
            }
            {
                thirdTaskData ?
                <Link url={`http://${thirdTaskData.url}`}>
                    <Color green>Open wordpress site</Color>
                </Link>
                :
                ''
            }
        </Box>
    );    
};


export default ProjectKickstart;

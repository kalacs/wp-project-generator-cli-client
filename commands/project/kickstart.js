import React, { useState } from 'react';
import { Box } from 'ink';
import Generate from './create';
import Create from '../services/create';
import Install from '../services-wordpress/install';

const getName = data => data.project.prefix;

/// Kickstart project
const ProjectKickstart = () => {
    const [ firstTaskData, setFirstTaskData ] = useState();
    const [ secondTaskData, setSecondTaskData ] = useState();
//    const [ thirdTaskData, setThirdTaskData ] = useState();

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
                <Install /> :
                ''
            }
        </Box>
    );    
};


export default ProjectKickstart;

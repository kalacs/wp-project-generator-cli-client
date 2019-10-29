import React, { Fragment } from 'react';
import { Box, Color, Text } from 'ink';

const Table = ({ data }) => {
    return (
        <Box>
        {data && data.length > 0 ?
            <Box flexDirection="column">
                <Box flexDirection="row">
                    {
                        Object.keys(data[0]).map((header, index) => (
                                <Box key={`header-${index}`} marginRight={2} flexGrow={1}>            
                                    <Color blue>
                                        <Text>{header.toUpperCase()}</Text>
                                    </Color>
                                </Box>
                            )
                        )
                    }
                </Box>
                <Box flexDirection="column">
                    {data.map((row, index) => {
                        return (
                            <Box key={`row-${index}`} flexDirection="row"  flexGrow={1}>{
                                    Object.values(row).map((cell, index) => {
                                        return (
                                            <Box key={`cell-${index}`} marginRight={2} justifyContent="flex-start">            
                                                <Text>{cell}</Text>
                                            </Box>
                                        );
                                    }
                                )
                            }</Box>
                        );
                    })}
                </Box>
            </Box>
            : 
            <Color white>
                <Text>No data</Text>
            </Color>
        }
            </Box>
    );
}

export default Table;
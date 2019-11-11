import React from 'react';
import { Field } from 'react-final-form'
import { Box, Color, Text } from 'ink'
import Error from '../components/Error'

const FormField = (
    {
        name,
        label,
        placeholder,
        format,
        validate,
        Input,
        inputConfig,
        onSubmit,
        isActive
    }
) => (
    <Field name={name} key={name} format={format} validate={validate}>
        {({ input, meta }) => {
            return (
                <Box flexDirection="column">
                    <Box>
                        <Text bold={isActive}>{label}: </Text>
                        {isActive ? (
                            <Input
                                {...input}
                                {...inputConfig}
                                {...meta.data.inputConfig}
                                placeholder={placeholder}
                                onSubmit={() => {
                                    onSubmit({ input, meta })
                                }}
                            />
                        ) : (
                            (input.value && <Text>{input.value}</Text>) ||
                            (placeholder && <Color gray>{placeholder}</Color>)
                        )}
                        {meta.invalid && meta.touched && (
                            <Box marginLeft={2}>
                                <Color red>✖</Color>
                            </Box>
                        )}
                        {meta.valid && meta.touched && meta.inactive && (
                            <Box marginLeft={2}>
                                <Color green>✔</Color>
                            </Box>
                        )}
                    </Box>
                    {meta.error && meta.touched && <Error>{meta.error}</Error>}
                </Box>
            )
        }}
    </Field>
)

export default FormField;
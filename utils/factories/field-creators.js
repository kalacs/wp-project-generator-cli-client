import TextInput from '../../components/TextInput'
import SelectInput from '../../components/SelectInput'
import MultiSelectInput from '../../components/MultiSelectInput'

export const createTextInput = (name, label, placeholder = '', format = value => value || '', validate = () => undefined) => ({
	name,
	label,
	placeholder,
	format,
	validate,
	Input: TextInput
})

export const createSelectInput = (name, label, inputConfig, format = value => value || '', validate = () => undefined) => ({
	name,
	label,
	inputConfig,
	format,
	validate,
	Input: SelectInput
})

export const createMultiSelectInput = (name, label, inputConfig, format = value => value, validate = undefined) => ({
	name,
	label,
	inputConfig,
	format,
	validate,
	Input: MultiSelectInput
})
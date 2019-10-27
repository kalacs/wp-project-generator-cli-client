import React from 'react'
import InkMultiSelect from 'ink-multi-select'

export default function MultiSelectInput({
	onBlur,
	onChange,
	onFocus,
	value = [],
	...props
}) {
	React.useEffect(() => {
		onFocus()
		return onBlur
	}, [onFocus, onBlur])
	return (
		<InkMultiSelect
			{...props}
			onSelect={({ value: v }) => onChange(value.concat(v))}
			onUnselect={({ value: v }) => onChange(value.filter(item => item !== v))}
		/>
	)
}
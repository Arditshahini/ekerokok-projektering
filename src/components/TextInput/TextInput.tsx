import styles from './TextInput.module.css'

export const TextInput = (props) => {
	const {
		placeholder,
		value,
		onInput,
	}	= props

	return (
		<input
			className={styles.textInput}
			type="text"
			value={value}
			placeholder={placeholder}
			onInput={onInput}
		/>
	)
}

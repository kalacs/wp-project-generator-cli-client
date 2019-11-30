import { useEffect, useState } from "react"
import { isFunction } from "util"

const useDataAPI = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [fetcher, setFetcher] = useState()

	useEffect(() => {
		async function fetch() {
			try {
				setError(null)
				setIsLoading(true)
				const response = isFunction(fetcher) ? await fetcher.call() : null
				setData(response);
				setIsLoading(false)
			} catch (error) {
				setError(error)
				setIsLoading(false)
			}
		}
		fetch()
	}, [fetcher])
	return [{ data, isLoading, error }, setFetcher]
}

export default useDataAPI

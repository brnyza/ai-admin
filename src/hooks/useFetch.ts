import { api } from '@/services/api'
import { useEffect, useState } from 'react'

type UseFetchResponse<T> = [T | undefined, boolean, any]

export function useFetch<T>(url: string, defaultValue?: T): UseFetchResponse<T> {
	const [value, setValue] = useState<T | undefined>(defaultValue)
	const [error, setError] = useState()
	const [isLoading, setIsLoading] = useState(!!url)

	const errorHandler = (error: any) => {
		console.info(`[useFetch rota: ${url}]:`, error)
		setError(error)
	}
	useEffect(() => {
		if (url) {
			setIsLoading(true)
			api
				.get(url)
				.then((response) => setValue(response.data))
				.catch(errorHandler)
				.finally(() => setIsLoading(false))
		} else {
			setValue(undefined)
		}
	}, [url])

	return [value || undefined, isLoading, error]
}

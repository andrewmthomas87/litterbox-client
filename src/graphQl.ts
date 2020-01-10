import { Observable, from, throwError } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'

import config from 'config'

function fromQuery<T>(query: string, variables: any = {}): Observable<T> {
	return fromFetch(config.graphQlUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		body: JSON.stringify({ query, variables }),
	}).pipe(
		mergeMap((response) => {
			if (response.status !== 200) {
				return throwError(response.status)
			}

			return from(response.json())
		}),
		map((json) => {
			if (json.errors) {
				throw json.errors
			}

			return json.data
		}))
}

export { fromQuery }

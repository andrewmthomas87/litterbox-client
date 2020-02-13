import * as React from 'react'
import { container, useBlocMappedState } from 'rx-bloc'

import { APP } from 'blocs'

import Information from './Information'
import User from './User'

const SignedIn = (): React.ReactElement | null => {
	const appBloc = container.get(APP)

	const state = useBlocMappedState(appBloc, state => state.type === 'user' ? state.stage : -1)

	let content: React.ReactElement | null
	switch (state) {
		case 1:
			content = <Information />
			break
		case 2:
			content = <User />
			break
		default:
			return null
	}

	return content
}

export default SignedIn

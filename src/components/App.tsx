import * as React from 'react'
import { container, useBlocMappedState } from 'rx-bloc'

import { APP } from 'blocs'

import SignedOut from './SignedOut'
import SignedIn from './SignedIn'

const App = (): React.ReactElement | null => {
	const appBloc = container.get(APP)

	React.useEffect(() => appBloc.dispatch({ type: 'initialize' }), [appBloc])

	const type = useBlocMappedState(appBloc, state => state.type)

	switch (type) {
		case 'initial':
			return null
		case 'signed_out':
			return <SignedOut />
		case 'user':
			return <SignedIn />
	}
}

export default App

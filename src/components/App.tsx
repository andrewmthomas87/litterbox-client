import * as React from 'react'
import { container, useBlocMappedState } from 'rx-bloc'

import { APP } from 'blocs'

const App = (): React.ReactElement | null => {
	const appBloc = container.get(APP)

	React.useEffect(() => appBloc.dispatch({ type: 'initialize' }), [appBloc])

	const type = useBlocMappedState(appBloc, state => state.type)

	switch (type) {
		case 'initial':
			return null
		case 'signed_out':
			return <p>Signed out</p>
		case 'user':
			return <p>Signed in</p>
	}
}

export default App

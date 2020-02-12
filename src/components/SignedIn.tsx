import * as React from 'react'
import { container, useBlocMappedState } from 'rx-bloc'
import { Container, Menu } from 'semantic-ui-react'

import { APP } from 'blocs'

import Information from './Information'

const SignedIn = (): React.ReactElement | null => {
	const appBloc = container.get(APP)

	const state = useBlocMappedState(appBloc, state => state.type === 'user' ? state.stage : -1)

	let menu: React.ReactElement | null
	let content: React.ReactElement | null
	switch (state) {
		case 1:
			menu = (
				<Menu pointing secondary>
					<Menu.Item name='Information' active />
					<Menu.Item name='Sign out'
						position='right'
						onClick={() => window.location.href = '/auth/sign-out'} />
				</Menu>
			)
			content = <Information />
			break
		default:
			return null
	}

	return (
		<Container>
			{menu}
			{content}
		</Container>
	)
}

export default SignedIn

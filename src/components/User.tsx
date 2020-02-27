import * as React from 'react'
import { Container, Menu } from 'semantic-ui-react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'

import config from 'config'

import { USER } from 'blocs'
import UserBloc, { UserPage } from 'blocs/UserBloc'

import Storage from './Storage'
import Pickup from './Pickup'

const User = (): React.ReactElement => {
	const userBloc = useTemporaryBloc(USER, () => new UserBloc())

	const page = useBlocMappedState(userBloc, state => state.page)

	let content: React.ReactElement
	switch (page) {
		case UserPage.STORAGE:
			content = <Storage />
			break
		case UserPage.PICKUP:
			content = <Pickup />
			break
		default:
			content = <div />
			break
	}

	return (
		<Container>
			<Menu pointing secondary>
				<Menu.Item name='Dashboard'
					active={page === UserPage.DASHBOARD}
					onClick={() => userBloc.dispatch({
						type: 'route',
						page: UserPage.DASHBOARD
					})} />
				<Menu.Item name='Information' />
				<Menu.Item name='Storage'
					active={page === UserPage.STORAGE}
					onClick={() => userBloc.dispatch({
						type: 'route',
						page: UserPage.STORAGE
					})} />
				<Menu.Item name='Pickup'
					active={page === UserPage.PICKUP}
					onClick={() => userBloc.dispatch({
						type: 'route',
						page: UserPage.PICKUP
					})} />
				<Menu.Item name='Sign out'
					position='right'
					onClick={() => window.location.href = config.signOutUrl} />
			</Menu>
			{content}
		</Container>
	)
}

export default User

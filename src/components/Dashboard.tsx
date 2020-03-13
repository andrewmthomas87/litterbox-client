import * as React from 'react'
import { container, useBlocMappedState } from 'rx-bloc'
import { Container, Step, Icon, Divider } from 'semantic-ui-react'

import { APP } from 'blocs'

const Dashboard = (): React.ReactElement => {
	const appBloc = container.get(APP)

	const name = useBlocMappedState(appBloc, state => state.type === 'user' ? state.name : '')

	return (
		<Container>
			<p>Hello <b>{name}</b>! Below are the steps you need to take.</p>
			<Divider />
			<Step.Group vertical>
				<Step completed>
					<Icon name='user' />
					<Step.Content>
						<Step.Title>Initial information</Step.Title>
						<Step.Description>Provide some basic information.</Step.Description>
					</Step.Content>
				</Step>
				<Step>
					<Icon name='payment' />
					<Step.Content>
						<Step.Title>Reservation</Step.Title>
						<Step.Description>Reserve your spot and starting boxes.</Step.Description>
					</Step.Content>
				</Step>
				<Step>
					<Icon name='boxes' />
					<Step.Content>
						<Step.Title>Storage</Step.Title>
						<Step.Description>Input the type and number of items you will be storing.</Step.Description>
					</Step.Content>
				</Step>
				<Step>
					<Icon name='calendar' />
					<Step.Content>
						<Step.Title>Pickup</Step.Title>
						<Step.Description>Configure your pickup type and time slot.</Step.Description>
					</Step.Content>
				</Step>
			</Step.Group>
		</Container>
	)
}

export default Dashboard

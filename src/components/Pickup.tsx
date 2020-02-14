import * as React from 'react'
import { Container, Icon, Table, Label, Button, List } from 'semantic-ui-react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'

import { PICKUP } from 'blocs'
import PickupBloc, { TimeSlot } from 'blocs/PickupBloc'

const Pickup = (): React.ReactElement => {
	const pickupBloc = useTemporaryBloc(PICKUP, () => new PickupBloc())

	React.useEffect(() => pickupBloc.dispatch({ type: 'initialize' }), [pickupBloc])

	const initial = useBlocMappedState(pickupBloc, state => state.type === 'initial')
	const startDate = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.startDate : null)
	const endDate = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.endDate : null)
	const timeSlots = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.timeSlots : new Map<number, TimeSlot[]>())

	if (initial || !(startDate && endDate)) {
		return <Container text textAlign='center'><Icon name='circle notched' loading /></Container>
	}

	const days = startDate.getDay() + Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + (7 - endDate.getDay())
	const weeks = days / 7

	const rows = []
	const date = new Date(startDate.getTime())
	date.setHours(-24 * startDate.getDay())
	for (let i = 0; i < weeks; i++) {
		const cells = []
		for (let j = 0; j < 7; j++) {
			const dateTimeSlots = timeSlots.get(date.getDate())

			let content: React.ReactElement | null
			if (dateTimeSlots) {
				content = <List>{dateTimeSlots.map(timeSlot => (
					<List.Item key={timeSlot.startTime + timeSlot.endTime}>
						<Button basic
							compact
							fluid
							toggle>{timeSlot.startTime}-{timeSlot.endTime}</Button>
					</List.Item>
				))}</List>
			} else {
				content = null
			}

			cells.push(
				<Table.Cell key={date.getDate()}>
					<Label>{date.getUTCMonth() + 1}/{date.getUTCDate()}</Label>
					{content}
				</Table.Cell>
			)

			date.setHours(24)
		}

		rows.push(<Table.Row key={i} verticalAlign='top'>{cells}</Table.Row>)
	}

	return (
		<Container>
			<p>Configure your pickup type and time slot.</p>
			<Table celled
				compact
				fixed>
				<Table.Header>
					<Table.Row textAlign='center'>
						<Table.HeaderCell>Sun</Table.HeaderCell>
						<Table.HeaderCell>Mon</Table.HeaderCell>
						<Table.HeaderCell>Tue</Table.HeaderCell>
						<Table.HeaderCell>Wed</Table.HeaderCell>
						<Table.HeaderCell>Thu</Table.HeaderCell>
						<Table.HeaderCell>Fri</Table.HeaderCell>
						<Table.HeaderCell>Sat</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>{rows}</Table.Body>
			</Table>
		</Container>
	)
}

export default Pickup

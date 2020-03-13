import * as React from 'react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'
import { Container, Icon, Table, Label, Button, List, Dimmer, Loader, Divider } from 'semantic-ui-react'

import { PICKUP } from 'blocs'
import PickupBloc, { TimeSlot } from 'blocs/PickupBloc'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const Pickup = (): React.ReactElement => {
	const pickupBloc = useTemporaryBloc(PICKUP, () => new PickupBloc())

	React.useEffect(() => pickupBloc.dispatch({ type: 'initialize' }), [pickupBloc])

	const initial = useBlocMappedState(pickupBloc, state => state.type === 'initial')
	const selecting = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.selecting : false)
	const startDate = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.startDate : null)
	const endDate = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.endDate : null)
	const timeSlots = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.timeSlots : new Map<number, TimeSlot[]>())
	const myTimeSlot = useBlocMappedState(pickupBloc, state => state.type === 'default' ? state.myPickupTimeSlot : null)

	if (initial || !(startDate && endDate)) {
		return <Container text textAlign='center'><Icon name='circle notched' loading /></Container>
	}

	const handleTimeSlotClick = (timeSlot: TimeSlot) => {
		return () => {
			pickupBloc.dispatch({
				type: 'selectTimeSlot',
				id: timeSlot.id
			})
		}
	}

	let currentTimeSlot: React.ReactElement
	if (myTimeSlot === null) {
		currentTimeSlot = <p>You have not selected a time slot.</p>
	} else {
		currentTimeSlot = <p>Your selected time slot is <b>{DAYS[myTimeSlot.date.getUTCDay()]} {myTimeSlot.date.getUTCMonth()}/{myTimeSlot.date.getUTCDate()}</b> between <b>{myTimeSlot.startTime}</b> and <b>{myTimeSlot.endTime}</b></p>
	}

	const days = startDate.getUTCDay() + Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + (7 - endDate.getUTCDay())
	const weeks = days / 7

	const rows = []
	const date = new Date(startDate.getTime())
	date.setHours(-24 * startDate.getUTCDay())
	for (let i = 0; i < weeks; i++) {
		const cells = []
		for (let j = 0; j < 7; j++) {
			const dateTimeSlots = timeSlots.get(date.getTime())

			let content: React.ReactElement | null
			if (dateTimeSlots) {
				content = <List>{dateTimeSlots.map(timeSlot => (
					<List.Item key={timeSlot.startTime + timeSlot.endTime}>
						<TimeSlot myTimeSlot={myTimeSlot}
							timeSlot={timeSlot}
							onClick={handleTimeSlotClick(timeSlot)} />
					</List.Item>
				))}</List>
			} else {
				content = null
			}

			cells.push(
				<Table.Cell key={date.getUTCDate()}>
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
			<Divider />
			{currentTimeSlot}
			<Dimmer.Dimmable>
				<Loader />
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
				<Dimmer active={selecting} inverted>
					<Loader />
				</Dimmer>
			</Dimmer.Dimmable>
			<Container>
				<List>
					<List.Item>
						<Button basic
							color='yellow'
							compact
							icon='clock' />
						<span style={{ paddingLeft: '0.25em' }}>Limited spots remaining</span>
					</List.Item>
					<List.Item>
						<Button basic
							color='red'
							compact
							disabled
							icon='clock' />
						<span style={{ paddingLeft: '0.25em' }}>No spots remaining</span>
					</List.Item>
				</List>
			</Container>
		</Container>
	)
}

interface TimeSlotProps {
	myTimeSlot: TimeSlot | null
	timeSlot: TimeSlot
	onClick(): void
}

const TimeSlot = ({ myTimeSlot, timeSlot, onClick }: TimeSlotProps): React.ReactElement => {
	if (myTimeSlot !== null && myTimeSlot.id === timeSlot.id) {
		return (
			<Button color='green'
				compact
				fluid>{timeSlot.startTime}-{timeSlot.endTime}</Button>
		)
	}

	let color: 'red' | 'yellow' | undefined
	if (timeSlot.count === timeSlot.capacity)
		color = 'red'
	else if ((timeSlot.capacity - timeSlot.count) <= 3)
		color = 'yellow'
	else
		color = undefined

	return (
		<Button basic
			color={color}
			compact
			disabled={timeSlot.count === timeSlot.capacity}
			fluid
			onClick={onClick}>{timeSlot.startTime}-{timeSlot.endTime}</Button>
	)
}

export default Pickup

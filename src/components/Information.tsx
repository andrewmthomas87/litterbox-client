import * as React from 'react'
import { Container, Header, Form, Menu, Icon, DropdownItemProps, Button } from 'semantic-ui-react'
import { useTemporaryBloc, useBlocMappedState, container } from 'rx-bloc'

import config from 'config'

import { APP, INFORMATION } from 'blocs'
import InformationBloc from 'blocs/InformationBloc'

const CAMPUS_BUILDINGS: DropdownItemProps[] = [{
	text: '1838 Chicago Ave.',
	value: '1838 Chicago Ave.'
},
{
	text: '2303 Sheridan Road (GREEN House)',
	value: '2303 Sheridan Road (GREEN House)'
},
{
	text: '2303 Sheridan Road (Residential College of Cultural & Community Studies)',
	value: '2303 Sheridan Road (Residential College of Cultural & Community Studies)'
},
{
	text: '2349 Sheridan Rd',
	value: '2349 Sheridan Rd'
},
{
	text: '560 Lincoln',
	value: '560 Lincoln'
},
{
	text: '720 Emerson St. (Sigma Alpha Iota)',
	value: '720 Emerson St. (Sigma Alpha Iota)'
},
{
	text: 'Allison Hall',
	value: 'Allison Hall'
},
{
	text: 'Ayers Hall (Residential College of Commerce & Industry)',
	value: 'Ayers Hall (Residential College of Commerce & Industry)'
},
{
	text: 'Bobb',
	value: 'Bobb'
},
{
	text: 'Chapin Hall (Humanities Residential College)',
	value: 'Chapin Hall (Humanities Residential College)'
},
{
	text: 'East Fairchild (Communications Residential College)',
	value: 'East Fairchild (Communications Residential College)'
},
{
	text: 'Elder Hall',
	value: 'Elder Hall'
},
{
	text: 'Foster-Walker Complex',
	value: 'Foster-Walker Complex'
},
{
	text: 'Goodrich House',
	value: 'Goodrich House'
},
{
	text: 'Hobart House (Women\'s Residential College)',
	value: 'Hobart House (Women\'s Residential College)'
},
{
	text: 'Jones Hall',
	value: 'Jones Hall'
},
{
	text: 'Kemper Hall',
	value: 'Kemper Hall'
},
{
	text: 'McCulloch',
	value: 'McCulloch'
},
{
	text: 'North Mid-Quads (Public Affairs Residential College)',
	value: 'North Mid-Quads (Public Affairs Residential College)'
},
{
	text: 'Rogers House',
	value: 'Rogers House'
},
{
	text: 'Sargent Hall',
	value: 'Sargent Hall'
},
{
	text: 'Shepard Hall',
	value: 'Shepard Hall'
},
{
	text: 'Slivka Hall (Residential College of Science and Engineering)',
	value: 'Slivka Hall (Residential College of Science and Engineering)'
},
{
	text: 'South Mid-Quads (Shepard Residential College)',
	value: 'South Mid-Quads (Shepard Residential College)'
},
{
	text: 'West Fairchild (International Studies Residential College)',
	value: 'West Fairchild (International Studies Residential College)'
},
{
	text: 'Willard Hall (Willard Residential College)',
	value: 'Willard Hall (Willard Residential College)'
}]

const Information = (): React.ReactElement => {
	const appBloc = container.get(APP)
	const informationBloc = useTemporaryBloc(INFORMATION, () => new InformationBloc(appBloc))

	const name = useBlocMappedState(appBloc, state => state.type === 'user' ? state.name : '')

	React.useEffect(() => informationBloc.dispatch({
		type: 'initialize',
		name
	}), [informationBloc])

	const initial = useBlocMappedState(informationBloc, state => state.type === 'initial')
	const onCampus = useBlocMappedState(informationBloc, state => state.type === 'default' ? state.data.onCampus : true)
	const submitting = useBlocMappedState(informationBloc, state => state.type === 'default' ? state.submitting : false)
	const errors = useBlocMappedState(informationBloc, state => state.type === 'default' ? state.errors : undefined)

	const handleDataChange = (key: string, value: string | boolean) => informationBloc.dispatch({
		type: 'setData',
		key, value
	})
	const handleSubmit = () => informationBloc.dispatch({ type: 'submit' })

	if (initial) {
		return <Container text textAlign='center'><Icon name='circle notched' loading /></Container>
	}

	let location: React.ReactElement
	if (onCampus) {
		location = (
			<Form.Select label='Which building?'
				options={CAMPUS_BUILDINGS}
				search
				fluid
				placeholder='Building'
				error={errors && errors.building ? errors.building : undefined}
				onChange={(_, { value }) => handleDataChange('building', value as string)} />
		)
	}
	else {
		location = (
			<Form.Input label='What is your address?'
				type='text'
				placeholder='Address'
				error={errors && errors.address ? errors.address : undefined}
				onChange={(_, { value }) => handleDataChange('address', value as string)} />
		)
	}

	return (
		<Container>
			<Menu pointing secondary>
				<Menu.Item name='Information' active />
				<Menu.Item name='Sign out'
					position='right'
					onClick={() => window.location.href = config.signOutUrl} />
			</Menu>
			<Container text>
				<Header as='h1'>Welcome!</Header>
				<p>First step, we need some basic information from you. Don't worry, you'll be able to change it later if necessary.</p>
				<Form loading={submitting} onSubmit={handleSubmit}>
					<Form.Input label='What is your full name?'
						type='text'
						defaultValue={name}
						placeholder='Full name'
						error={errors && errors.name ? errors.name : undefined}
						onChange={(_, { value }) => handleDataChange('name', value)} />
					<Form.Checkbox label='Do you currently live in a campus building?'
						checked={onCampus}
						onChange={(_, { checked }) => handleDataChange('onCampus', !!checked)} />
					{location}
					<Form.Checkbox label='Next year, will you live in a campus building?'
						defaultChecked
						onChange={(_, { checked }) => handleDataChange('onCampusFuture', !!checked)} />
					<Button type='submit'>Save</Button>
				</Form>
			</Container>
		</Container>
	)
}

export default Information

import * as React from 'react'
import { Container, Divider, Card, Icon, Header, Table, Button } from 'semantic-ui-react'

const Storage = (): React.ReactElement => {
	return (
		<Container style={{ paddingBottom: '2em' }}>
			<p>Input the type and number of items you will be storing.</p>
			<Divider />
			<Card.Group>
				<Card>
					<Card.Content header='Large boxes' meta='$40' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 3
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='Book boxes' meta='$25' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 2
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='Bins' meta='$40' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 0
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='Fridges' meta='$30' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 1
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='Bikes' meta='$50' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 0
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='TVs' meta='$50' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 0
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content header='Other' meta='$25-75' />
					<Card.Content description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Card.Content>
					<Card.Content extra>
						<Icon name='clipboard list' />
						Quantity: 0
						<Button.Group compact
							size='tiny'
							floated='right'>
							<Button icon='minus' />
							<Button icon='plus' />
						</Button.Group>
					</Card.Content>
				</Card>
			</Card.Group>
			<Header as='h2'>Estimated Price</Header>
			<Table basic='very'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={5}>Item</Table.HeaderCell>
						<Table.HeaderCell width={1}>#</Table.HeaderCell>
						<Table.HeaderCell width={2}>Price</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Large boxes</Table.Cell>
						<Table.Cell>3</Table.Cell>
						<Table.Cell>$120</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Book boxes</Table.Cell>
						<Table.Cell>2</Table.Cell>
						<Table.Cell>$50</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Fridges</Table.Cell>
						<Table.Cell>1</Table.Cell>
						<Table.Cell>$30</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Total</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>$200</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</Container>
	)
}

export default Storage

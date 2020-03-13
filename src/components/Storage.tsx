import * as React from 'react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'
import { Container, Divider, Card, Icon, Header, Table, Button, Message, Dimmer, Loader } from 'semantic-ui-react'

import { STORAGE } from 'blocs'
import StorageBloc from 'blocs/StorageBloc'

import s from 'less/storage.less'

const Storage = (): React.ReactElement => {
	const storageBloc = useTemporaryBloc(STORAGE, () => new StorageBloc())

	React.useEffect(() => storageBloc.dispatch({ type: 'initialize' }), [storageBloc])

	const initial = useBlocMappedState(storageBloc, state => state.type === 'initial')
	const storageItems = useBlocMappedState(storageBloc, state => state.type === 'default' ? state.storageItems : [])
	const quantities = useBlocMappedState(storageBloc, state => state.type === 'default' ? state.quantities : new Map())
	const dirty = useBlocMappedState(storageBloc, state => state.type === 'default' ? state.dirty : false)
	const loading = useBlocMappedState(storageBloc, state => state.type === 'default' ? state.loading : false)

	const handleSave = () => storageBloc.dispatch({ type: 'saveQuantities' })
	const handleRevert = () => storageBloc.dispatch({ type: 'revertQuantities' })
	const handleUpdateQuantity = (itemID: number, delta: number) => () => storageBloc.dispatch({
		type: 'updateQuantity',
		itemID,
		delta
	})

	if (initial) {
		return <Container text textAlign='center'><Icon name='circle notched' loading /></Container>
	}

	const storageItemElements = storageItems.map(storageItem => (
		<Card key={storageItem.id}>
			<Card.Content header={storageItem.name} meta={`$${storageItem.price}`} />
			<Card.Content description>{storageItem.description}</Card.Content>
			<Card.Content extra>
				<Icon name='clipboard list' />
				Quantity: {quantities.get(storageItem.id) || 0}
				<Button.Group compact
					size='tiny'
					floated='right'>
					<Button icon='plus' onClick={handleUpdateQuantity(storageItem.id, 1)} />
					<Button icon='minus'
						disabled={(quantities.get(storageItem.id) || 0) === 0}
						onClick={handleUpdateQuantity(storageItem.id, -1)} />
				</Button.Group>
			</Card.Content>
		</Card>
	))

	let totalPrice = 0
	const priceElements: React.ReactElement[] = []
	storageItems.forEach((storageItem) => {
		const quantity = quantities.get(storageItem.id) || 0
		if (quantity > 0) {
			const price = quantity * storageItem.price
			totalPrice += price
			priceElements.push(
				<Table.Row key={storageItem.id}>
					<Table.Cell>{storageItem.name}</Table.Cell>
					<Table.Cell>{quantity}</Table.Cell>
					<Table.Cell>${price}</Table.Cell>
				</Table.Row>
			)
		}
	})

	return (
		<Container style={{ paddingBottom: '2em' }}>
			<p>Input the type and number of items you will be storing.</p>
			<Divider />
			<Message warning={dirty} success={!dirty}>
				<div className={s.dirty}>
					<div className={s.message}>{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</div>
					<Button.Group compact>
						<Button positive
							disabled={!dirty}
							onClick={handleSave}>Save</Button>
						<Button disabled={!dirty} onClick={handleRevert}>Revert</Button>
					</Button.Group>
				</div>
			</Message>
			<Dimmer.Dimmable as='div'>
				<Dimmer active={loading} inverted>
					<Loader />
				</Dimmer>
				<Card.Group>{storageItemElements}</Card.Group>
				<Header as='h2' style={{ marginTop: '1.5em' }}>Estimated price</Header>
				<Table basic='very'>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={5}>Item</Table.HeaderCell>
							<Table.HeaderCell width={1}>#</Table.HeaderCell>
							<Table.HeaderCell width={2}>Price</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{priceElements}
						<Table.Row>
							<Table.Cell>Total</Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell>${totalPrice}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</Dimmer.Dimmable>
		</Container>
	)
}

export default Storage

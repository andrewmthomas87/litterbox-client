import { Observable, empty, of, concat } from 'rxjs'
import { map } from 'rxjs/operators'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'

interface StorageItem {
	id: number
	name: string
	price: number
	description: string
}

// Events

interface InitializeStorageEvent {
	type: 'initialize'
}

interface SaveQuantitiesStorageEvent {
	type: 'saveQuantities'
}

interface RevertQuantitiesStorageEvent {
	type: 'revertQuantities'
}

interface UpdateQuantityStorageEvent {
	type: 'updateQuantity'
	itemID: number
	delta: number
}

type StorageEvent = InitializeStorageEvent | SaveQuantitiesStorageEvent | RevertQuantitiesStorageEvent | UpdateQuantityStorageEvent

// States

interface InitialStorageState {
	type: 'initial'
}

interface DefaultStorageState {
	type: 'default'
	storageItems: StorageItem[]
	quantities: Map<number, number>
	dirty: boolean
	loading: boolean
}

type StorageState = InitialStorageState | DefaultStorageState

// Bloc

class StorageBloc extends Bloc<StorageEvent, StorageState> {
	public constructor() {
		super(() => ({ type: 'initial' }))
	}

	protected _mapEventToState(event: StorageEvent): Observable<StorageState> {
		switch (event.type) {
			case 'initialize':
				return this._initialize()
			case 'saveQuantities':
				return this._saveQuantities()
			case 'revertQuantities':
				return this._revertQuantities()
			case 'updateQuantity':
				return this._updateQuantity(event)
		}
	}

	private _initialize(): Observable<StorageState> {
		return fromQuery<any>(`query InitialStorage {
			storageItems {
				id
				name
				price
				description
			}
			myStorageItemQuantities {
				itemID
				quantity
			}
		}`).pipe(
			map((data) => {
				const quantities: Map<number, number> = new Map()
				for (let quantity of data.myStorageItemQuantities)
					quantities.set(quantity.itemID, quantity.quantity)

				return {
					type: 'default',
					storageItems: data.storageItems,
					quantities,
					dirty: false,
					loading: false
				} as StorageState
			})
		)
	}

	private _saveQuantities(): Observable<StorageState> {
		if (this.currentState.type !== 'default')
			return empty()

		const currentState = this.currentState

		const quantities: any[] = []
		currentState.quantities.forEach((quantity, itemID) => quantities.push({ itemID, quantity }))

		return concat(
			of({
				...currentState,
				dirty: false,
				loading: true
			}),
			fromQuery<any>(`mutation SaveQuantities($quantities: StorageItemQuantitiesInput!) {
					setStorageItemQuantities(quantities: $quantities) {
						itemID
						quantity
					}
				}`, {
				quantities: { quantities }
			}).pipe(
				map((data) => {
					const quantities: Map<number, number> = new Map()
					for (let quantity of data.setStorageItemQuantities)
						quantities.set(quantity.itemID, quantity.quantity)

					return {
						...currentState,
						quantities,
						dirty: false,
						loading: false
					} as StorageState
				})
			)
		)
	}

	private _revertQuantities(): Observable<StorageState> {
		if (this.currentState.type !== 'default')
			return empty()

		const currentState = this.currentState

		return concat(
			of({
				...currentState,
				dirty: false,
				loading: true
			}),
			fromQuery<any>(`query RevertQuantities {
				myStorageItemQuantities {
					itemID
					quantity
				}
			}`).pipe(
				map((data) => {
					const quantities: Map<number, number> = new Map()
					for (let quantity of data.myStorageItemQuantities)
						quantities.set(quantity.itemID, quantity.quantity)

					return {
						...currentState,
						quantities,
						dirty: false,
						loading: false
					} as StorageState
				})
			)
		)
	}

	private _updateQuantity(event: UpdateQuantityStorageEvent): Observable<StorageState> {
		if (this.currentState.type !== 'default')
			return empty()

		const quantities = new Map(this.currentState.quantities)
		quantities.set(event.itemID, (quantities.get(event.itemID) || 0) + event.delta)
		return of({
			...this.currentState,
			quantities,
			dirty: true
		})
	}
}

export { StorageItem, StorageEvent, StorageState, StorageBloc as default }

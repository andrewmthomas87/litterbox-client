import { Bloc } from 'rx-bloc'
import { Observable, of, empty, concat } from 'rxjs'
import { mapTo, catchError, tap } from 'rxjs/operators'

import { fromQuery } from 'graphQl'

import { AppEvent } from './AppBloc'

// Events

interface InitializeInformationEvent {
	type: 'initialize'
	name: string
}

interface SetDataInformationEvent {
	type: 'setData'
	key: string
	value: any
}

interface SubmitInformationEvent {
	type: 'submit'
}

type InformationEvent = InitializeInformationEvent | SetDataInformationEvent | SubmitInformationEvent

// States

interface InitialInformationState {
	type: 'initial'
}

interface InformationData {
	name: string
	onCampus: boolean
	building: string
	address: string
	onCampusFuture: boolean
}
interface InformationErrors {
	name?: string
	building?: string
	address?: string
}
interface DefaultInformationState {
	type: 'default'
	data: InformationData
	submitting: boolean
	errors?: InformationErrors
}

type InformationState = InitialInformationState | DefaultInformationState

class InformationBloc extends Bloc<InformationEvent, InformationState> {
	private _appBloc: Bloc<AppEvent, any>

	public constructor(appBloc: Bloc<AppEvent, any>) {
		super(() => ({ type: 'initial' }))

		this._appBloc = appBloc
	}

	protected _mapEventToState(event: InformationEvent): Observable<InformationState> {
		switch (event.type) {
			case 'initialize':
				return this._initialize(event)
			case 'setData':
				return this._setData(event)
			case 'submit':
				return this._submit(event)
		}
	}

	private _initialize(event: InitializeInformationEvent): Observable<InformationState> {
		return of({
			type: 'default',
			data: {
				name: event.name,
				onCampus: true,
				building: '',
				address: '',
				onCampusFuture: true
			},
			submitting: false
		})
	}

	private _setData(event: SetDataInformationEvent): Observable<InformationState> {
		if (this.currentState.type !== 'default') {
			return empty()
		}

		const state = { ...this.currentState }
		switch (event.key) {
			case 'name':
				state.data.name = event.value
				break
			case 'onCampus':
				state.data.onCampus = event.value
				if (state.data.onCampus) {
					state.data.address = ''
				}
				else {
					state.data.building = ''
				}
				break
			case 'building':
				state.data.building = event.value
				break
			case 'address':
				state.data.address = event.value
				break
			case 'onCampusFuture':
				state.data.onCampusFuture = event.value
				break
		}

		return of(state)
	}

	private _submit(_: SubmitInformationEvent): Observable<InformationState> {
		if (this.currentState.type !== 'default' || this.currentState.submitting) {
			return empty()
		}

		const { name, onCampus, building, address, onCampusFuture } = this.currentState.data
		const errors: InformationErrors = {}
		if (!name) {
			errors.name = 'Name required'
		}
		if (onCampus && !building) {
			errors.building = 'Building required'
		}
		if (!onCampus && !address) {
			errors.address = 'Address required'
		}
		if (errors.name || errors.building || errors.address) {
			return of({
				...this.currentState,
				errors
			})
		}

		return concat<InformationState>(
			of({
				...this.currentState,
				submitting: true,
				errors: undefined
			}),
			fromQuery<any>(`mutation SaveInformation($input: InformationInput!) {
				saveInformation(information: $input) {
					email
					name
					stage
				}
			}`, {
				input: { name, onCampus, building, address, onCampusFuture }
			}).pipe(
				mapTo(({ type: 'initial' })),
				catchError((errors: any) => of({
					...this.currentState,
					submitting: false,
					errors: JSON.parse(errors[0].message)
				})),
				tap(() => this._appBloc.dispatch({ type: 'refresh' }))
			)
		)
	}
}

export { InformationEvent, InformationState, InformationBloc as default }

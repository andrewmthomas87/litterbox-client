import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'

interface TimeSlot {
	id: string
	date: string
	startTime: string
	endTime: string
}

// Events

interface InitializePickupEvent {
	type: 'initialize'
}

type PickupEvent = InitializePickupEvent

// States

interface InitialPickupState {
	type: 'initial'
}

interface DefaultPickupState {
	type: 'default'
	timeSlots: TimeSlot[]
}

type PickupState = InitialPickupState | DefaultPickupState

// Bloc

class PickupBloc extends Bloc<PickupEvent, PickupState> {
	public constructor() {
		super(() => ({ type: 'initial' }))
	}

	protected _mapEventToState(event: PickupEvent): Observable<PickupState> {
		switch (event.type) {
			case 'initialize':
				return this._initialize()
		}
	}

	private _initialize(): Observable<PickupState> {
		return fromQuery<any>(`query PickupTimeSlots {
			pickupTimeSlots {
				id
				date
				startTime
				endTime
			}
		}`).pipe(
			map((data) => ({
				type: 'default',
				timeSlots: data.pickupTimeSlots
			} as PickupState))
		)
	}
}

export { PickupEvent, PickupState, PickupBloc as default }

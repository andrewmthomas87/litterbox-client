import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'

interface TimeSlot {
	id: string
	date: Date
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
	startDate: Date
	endDate: Date
	timeSlots: Map<number, TimeSlot[]>
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
			map((data) => {
				const allTimeSlots: TimeSlot[] = data.pickupTimeSlots.map(({ id, date, startTime, endTime }: any) => ({
					id,
					date: new Date(date),
					startTime, endTime
				}))

				const startDate = allTimeSlots[0].date
				const endDate = allTimeSlots[allTimeSlots.length - 1].date

				const timeSlots = new Map<number, TimeSlot[]>()
				for (let timeSlot of allTimeSlots) {
					const dateTimeSlots = timeSlots.get(timeSlot.date.getDate())
					if (dateTimeSlots) {
						dateTimeSlots.push(timeSlot)
					} else {
						timeSlots.set(timeSlot.date.getDate(), [timeSlot])
					}
				}

				return {
					type: 'default',
					startDate, endDate, timeSlots
				} as PickupState
			})
		)
	}
}

export { TimeSlot, PickupEvent, PickupState, PickupBloc as default }

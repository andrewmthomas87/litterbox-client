import { Observable, empty, concat, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'

interface TimeSlot {
	id: number
	date: Date
	startTime: string
	endTime: string
	capacity: number
	count: number
}

// Events

interface InitializePickupEvent {
	type: 'initialize'
}

interface SelectTimeSlotPickupEvent {
	type: 'selectTimeSlot'
	id: number
}

type PickupEvent = InitializePickupEvent | SelectTimeSlotPickupEvent

// States

interface InitialPickupState {
	type: 'initial'
}

interface DefaultPickupState {
	type: 'default'
	startDate: Date
	endDate: Date
	timeSlots: Map<number, TimeSlot[]>
	myPickupTimeSlot: TimeSlot | null
	selecting: boolean
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
			case 'selectTimeSlot':
				return this._selectTimeSlot(event)
		}
	}

	private _initialize(): Observable<PickupState> {
		return fromQuery<any>(`query PickupTimeSlots {
			pickupTimeSlots {
				id
				date
				startTime
				endTime
				capacity
				count
			}
			myPickupTimeSlot {
				id
				date
				startTime
				endTime
			}
		}`).pipe(
			map((data) => {
				const allTimeSlots: TimeSlot[] = data.pickupTimeSlots.map(({ id, date, startTime, endTime, capacity, count }: any) => ({
					id,
					date: new Date(`${date} 00:00:00`),
					startTime, endTime, capacity, count,
					selecting: false
				}))

				const startDate = allTimeSlots[0].date
				const endDate = allTimeSlots[allTimeSlots.length - 1].date

				const timeSlots = new Map<number, TimeSlot[]>()
				for (let timeSlot of allTimeSlots) {
					const dateTimeSlots = timeSlots.get(timeSlot.date.getTime())
					if (dateTimeSlots) {
						dateTimeSlots.push(timeSlot)
					} else {
						timeSlots.set(timeSlot.date.getTime(), [timeSlot])
					}
				}

				let myPickupTimeSlot
				if (data.myPickupTimeSlot) {
					const { id, date, startTime, endTime } = data.myPickupTimeSlot
					myPickupTimeSlot = {
						id,
						date: new Date(`${date} 00:00:00`),
						startTime, endTime
					}
				} else {
					myPickupTimeSlot = null
				}

				return {
					type: 'default',
					startDate, endDate, timeSlots, myPickupTimeSlot
				} as PickupState
			})
		)
	}

	private _selectTimeSlot(event: SelectTimeSlotPickupEvent): Observable<PickupState> {
		if (this.currentState.type !== 'default' || this.currentState.selecting)
			return empty()

		return concat(of({
			...this.currentState,
			selecting: true
		}), fromQuery<any>(`mutation SelectPickupTimeSlot($id: Int!) {
			selectPickupTimeSlot(id: $id) {
				id
				date
				startTime
				endTime
			}
		}`, { id: event.id }).pipe(
			map(data => ({
				...this.currentState,
				myPickupTimeSlot: {
					...data.selectPickupTimeSlot,
					date: new Date(`${data.selectPickupTimeSlot.date} 00:00:00`)
				},
				selecting: false
			} as PickupState)),
			catchError(() => empty())
		))
	}
}

export { TimeSlot, PickupEvent, PickupState, PickupBloc as default }

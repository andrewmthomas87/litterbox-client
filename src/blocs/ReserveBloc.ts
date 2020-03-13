import { Observable, of, empty } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Bloc } from 'rx-bloc'

import config from 'config'
import { fromQuery } from 'graphQl'

// Events

interface GenerateSessionReserveEvent {
	type: 'generateSession'
}

type ReserveEvent = GenerateSessionReserveEvent

// States

interface InitialReserveState {
	type: 'initial'
	loading: boolean
}

type ReserveState = InitialReserveState

// Bloc

class ReserveBloc extends Bloc<ReserveEvent, ReserveState> {
	private _stripe: any

	public constructor() {
		super(() => ({
			type: 'initial',
			loading: false
		}))

		this._stripe = Stripe(config.stripeKey)
	}

	protected _mapEventToState(event: ReserveEvent): Observable<ReserveState> {
		switch (event.type) {
			case 'generateSession':
				return this._generateSession()
		}
	}

	private _generateSession(): Observable<ReserveState> {
		if (this.currentState.loading)
			return empty()

		fromQuery<any>(`mutation GenerateReservationSession {
				generateReservationSession
			}`).pipe(
			tap(data => this._stripe.redirectToCheckout({ sessionId: data.generateReservationSession }))
		).subscribe()

		return of({
			type: 'initial',
			loading: true
		})
	}
}

export { ReserveEvent, ReserveState, ReserveBloc as default }

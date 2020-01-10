import { Observable, of } from 'rxjs'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'
import { map, catchError } from 'rxjs/operators'

// Events

interface InitializeAppEvent {
	type: 'initialize'
}

type AppEvent = InitializeAppEvent

// States

interface InitialAppState {
	type: 'initial'
}

interface SignedOutState {
	type: 'signed_out'
}

interface UserAppState {
	type: 'user'
	email: string
	name: string
}

type AppState = InitialAppState | SignedOutState | UserAppState

// Bloc

class AppBloc extends Bloc<AppEvent, AppState> {
	public constructor() {
		super(() => ({ type: 'initial' }))
	}

	protected _mapEventToState(event: AppEvent): Observable<AppState> {
		switch (event.type) {
			case 'initialize':
				return this._initialize()
		}
	}

	private _initialize(): Observable<AppState> {
		return fromQuery<any>(`{
			me {
				email
				name
			}
		}`)
			.pipe(
				map(data => ({
					type: 'user',
					email: data.me.email,
					name: data.me.name
				} as UserAppState)),
				catchError(_ => of({ type: 'signed_out' } as SignedOutState)))
	}
}

export { AppEvent, AppState, AppBloc as default }

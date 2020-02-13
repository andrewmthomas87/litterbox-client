import { Observable, of, concat } from 'rxjs'
import { Bloc } from 'rx-bloc'

import { fromQuery } from 'graphQl'
import { map, catchError } from 'rxjs/operators'

// Events

interface InitializeAppEvent {
	type: 'initialize'
}

interface RefreshAppEvent {
	type: 'refresh'
}

type AppEvent = InitializeAppEvent | RefreshAppEvent

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
	stage: number
}

type AppState = InitialAppState | SignedOutState | UserAppState

// Bloc

class AppBloc extends Bloc<AppEvent, AppState> {
	public constructor() {
		super(() => ({ type: 'initial' }))
	}

	protected _mapEventToState(event: AppEvent): Observable<AppState> {
		console.log('EVENT', event)

		switch (event.type) {
			case 'initialize':
				return this._initialize()
			case 'refresh':
				return this._refresh()
		}
	}

	private _initialize(): Observable<AppState> {
		return fromQuery<any>(`{
			me {
				email
				name
				stage
			}
		}`).pipe(
			map(data => ({
				type: 'user',
				email: data.me.email,
				name: data.me.name,
				stage: data.me.stage
			} as UserAppState)),
			catchError(_ => of({ type: 'signed_out' } as SignedOutState))
		)
	}

	private _refresh(): Observable<AppState> {
		return concat(of({ type: 'initial' } as AppState), this._initialize())
	}
}

export { AppEvent, AppState, AppBloc as default }

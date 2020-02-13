import { Observable, of } from 'rxjs'
import { Bloc } from 'rx-bloc'

enum UserPage {
    DASHBOARD,
    STORAGE,
    PICKUP
}

// Events

interface RouteUserEvent {
    type: 'route'
    page: UserPage
}

type UserEvent = RouteUserEvent

// States

interface DefaultUserState {
    type: 'default'
    page: UserPage
}

type UserState = DefaultUserState

// Bloc

class UserBloc extends Bloc<UserEvent, UserState> {
    public constructor() {
        super(() => ({
            type: 'default',
            page: UserPage.DASHBOARD
        }))
    }

    protected _mapEventToState(event: UserEvent): Observable<UserState> {
        switch (event.type) {
            case 'route':
                return this._route(event)
        }
    }

    private _route(event: RouteUserEvent): Observable<UserState> {
        return of({
            ...this.currentState,
            page: event.page
        })
    }
}

export { UserPage, UserEvent, UserState, UserBloc as default }

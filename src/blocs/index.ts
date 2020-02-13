import { BlocKey, container } from 'rx-bloc'

import AppBloc, { AppEvent, AppState } from './AppBloc'
import { InformationEvent, InformationState } from './InformationBloc'
import { UserEvent, UserState } from './UserBloc'
import { PickupEvent, PickupState } from './PickupBloc'

const APP: BlocKey<AppEvent, AppState> = { symbol: Symbol('app') }
container.register(APP, new AppBloc())

container.get(APP).state.subscribe(state => console.log('STATE', state))

const INFORMATION: BlocKey<InformationEvent, InformationState> = { symbol: Symbol('information') }
const USER: BlocKey<UserEvent, UserState> = { symbol: Symbol('user') }
const PICKUP: BlocKey<PickupEvent, PickupState> = { symbol: Symbol('pickup') }

export { APP, INFORMATION, USER, PICKUP }

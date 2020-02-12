import { BlocKey, container } from 'rx-bloc'

import AppBloc, { AppEvent, AppState } from './AppBloc'
import { InformationEvent, InformationState } from './InformationBloc'

const APP: BlocKey<AppEvent, AppState> = { symbol: Symbol('app') }
container.register(APP, new AppBloc())

container.get(APP).state.subscribe(state => console.log('STATE', state))

const INFORMATION: BlocKey<InformationEvent, InformationState> = { symbol: Symbol('information') }

export { APP, INFORMATION }

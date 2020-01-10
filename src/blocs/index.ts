import { BlocKey, container } from 'rx-bloc'

import AppBloc, { AppEvent, AppState } from './AppBloc'

const APP: BlocKey<AppEvent, AppState> = { symbol: Symbol('app') }
container.register(APP, new AppBloc())

export { APP }

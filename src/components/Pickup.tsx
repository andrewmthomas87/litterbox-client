import * as React from 'react'
import { Container, Icon } from 'semantic-ui-react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'

import { PICKUP } from 'blocs'
import PickupBloc from 'blocs/PickupBloc'

const Pickup = (): React.ReactElement => {
	const pickupBloc = useTemporaryBloc(PICKUP, () => new PickupBloc())

	React.useEffect(() => pickupBloc.dispatch({ type: 'initialize' }), [pickupBloc])

	const initial = useBlocMappedState(pickupBloc, state => state.type === 'initial')

	if (initial) {
		return <Container text textAlign='center'><Icon name='circle notched' loading /></Container>
	}

	return (
		<Container text>
			<p>Configure your pickup type and time slot.</p>
		</Container>
	)
}

export default Pickup

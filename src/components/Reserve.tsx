import * as React from 'react'
import { useTemporaryBloc, useBlocMappedState } from 'rx-bloc'
import { Container, Divider, Button } from 'semantic-ui-react'

import { RESERVE } from 'blocs'
import ReserveBloc from 'blocs/ReserveBloc'

const Reserve = (): React.ReactElement => {
	const reserveBloc = useTemporaryBloc(RESERVE, () => new ReserveBloc())

	const loading = useBlocMappedState(reserveBloc, state => state.loading)

	const handleReserve = () => reserveBloc.dispatch({ type: 'generateSession' })

	return (
		<Container>
			<p>Reserve your spot and starting boxes.</p>
			<Divider />
			<Button primary
				loading={loading}
				onClick={handleReserve}>Reserve spot</Button>
		</Container>
	)
}

export default Reserve

import * as React from 'react'
import { Container, Header, Button } from 'semantic-ui-react'

const SignedOut = (): React.ReactElement => (
	<Container text>
		<Header as='h2'>Signed out</Header>
		<Button as='a' href='/auth/sign-in'>Sign in</Button>
	</Container>
)

export default SignedOut

import React from 'react'
import styled from 'styled-components'
import { Anchor } from '../icons'

const Logo = () => {
  return (
    <LogoContainer>
      Movie<IconContainer><Anchor large /></IconContainer>Night
    </LogoContainer>
  )
}

export default Logo

const LogoContainer = styled.div`
  flex-shrink: 0;
  color: rgb(2,117,216);
  text-decoration: underline;
  font-family: CopperPlate, Times;
  paddingTop: 3px;
`

const IconContainer = styled.span`
  margin: 0 5px;
`

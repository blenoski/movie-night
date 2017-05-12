import React from 'react'
import styled from 'styled-components'
import { Anchor } from '../icons'

const Logo = ({ className }) => {
  return (
    <LogoContainer className={className}>
      Movie<StyledAnchor large />Night
    </LogoContainer>
  )
}

export default Logo

const LogoContainer = styled.div`
  flex-shrink: 0;
  color: rgba(2,117,216,1);
  text-decoration: underline;
  font-family: CopperPlate, Times;
  paddingTop: 3px;
`

const StyledAnchor = styled(Anchor)`
  margin: 0 5px;
`

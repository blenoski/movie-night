import React from 'react'
import styled from 'styled-components'
import { FileIcon } from '../../../icons'

export default ({ location, handleClick }) =>
  <Section onClick={handleClick}>
    <StyledFileIcon video large />
    <h6>{location}</h6>
  </Section>

const Section = styled.section`
  display: flex;
  cursor: pointer;
  margin-top: 30px;
  &:hover {
    color: rgba(255,255,255,0.9);
  }
`

const StyledFileIcon = styled(FileIcon)`
  margin-right: 5px;
  `

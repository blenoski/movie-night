import React from 'react'
import styled from 'styled-components'
import { Ban, FileIcon } from '../../../icons'

export default ({ location, handleClick, fileExists }) => {
  if (fileExists) {
    return renderClickable(handleClick, location)
  } else {
    return renderNotClickable(location)
  }
}

const renderClickable = (handleClick, location) =>
  <ClickableSection onClick={handleClick}>
    <ClickableFileIcon video large />
    <h6>{location}</h6>
  </ClickableSection>

const renderNotClickable = (location) =>
  <Section>
    <IconStack>
      <RelativelyPositionedFileIcon video large />
      <DangerOverlay size3x />
    </IconStack>
    <h6>{location}</h6>
  </Section>

const Section = styled.section`
  display: flex;
  margin-top: 30px;
  word-break: break-all;
`

const ClickableSection = styled(Section)`
  cursor: pointer;
  &:hover {
    color: rgba(255,255,255,0.9);
  }
`

const ClickableFileIcon = styled(FileIcon)`
  margin-right: 5px;
`

const IconStack = styled.span`
  display: flex;
  marginRight: 15px;
`
const RelativelyPositionedFileIcon = styled(FileIcon)`
  position: relative;
`
const DangerOverlay = styled(Ban)`
  position: absolute;
  margin: -15px 0 0 -12px;
  color: rgba(217,83,79,0.5);
`

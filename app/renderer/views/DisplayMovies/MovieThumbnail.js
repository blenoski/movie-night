import React from 'react'
import styled from 'styled-components'

export default ({ title, imgFile }) =>
  <ImageContainer>
    <StyledImage
      src={imgFile}
      alt={title}
    />
  </ImageContainer>

const ImageContainer = styled.div`
  margin: 5px 10px 5px 0px;
  backgroundColor: #141414;
  color: #999;
  display: inline-block;
  cursor: pointer;
`

const StyledImage = styled.img`
  width: 150px;
  height: 222px;
`
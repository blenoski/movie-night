import React from 'react'
import styled from 'styled-components'

export default ({ actors, director, genres }) =>
  <Section>
    <Item>
      <Heading>Starring:</Heading> {actors.join(', ')}
    </Item>
    <Item>
      <Heading>Director:</Heading> {director}
    </Item>
    <Item>
      <Heading>Genres:</Heading> {genres.join(', ')}
    </Item>
  </Section>

const Section = styled.section`
  margin-top: 24px;
`

const Heading = styled.span`
  color: rgba(255, 255, 255, 0.9);
`

const Item = styled.h6`
  text-transform: capitalize;
`

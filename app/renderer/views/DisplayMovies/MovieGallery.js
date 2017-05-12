import React from 'react'
import styled from 'styled-components'
import { Chevron } from '../../icons'
import MovieThumbnail from './MovieThumbnail'

export default ({ genre, movies }) => {
  const thumbnails = movies.map((movie) => {
    return <MovieThumbnail
      key={movie.imdbID}
      title={movie.title}
      imgFile={movie.imgFile}
    />
  })

  return (
    <Gallery key={genre}>
      <Title>{genre}<Chevron right fixedWidth /></Title>
      <HorizontalScrollContainer>{thumbnails}</HorizontalScrollContainer>
    </Gallery>
  )
}

const Gallery = styled.div`
  marginTop: 30px;
  marginRight: 10px;
`

const Title = styled.h2`
  line-height: 1.3;
  margin: 0;
  display: block;
  font-size: 1.2em;
  font-weight: bold;
  color: #999;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: transparent;
  text-transform: capitalize;
`

const HorizontalScrollContainer = styled.div`
  display: flex;
  overflowX: auto;
`
/* [SAVE] Custom scrollbar styling
  &::-webkit-scrollbar {
      height: 10px;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-track {
      display: none;
  }

  &::-webkit-scrollbar-track:hover {
    display: block;
    border-radius: 10px;
    box-shadow: inset 0 0 4px rgba(255,255,255,0.4);
  }

  &::-webkit-scrollbar-thumb {
      display: block;
      border-radius: 10px;
      box-shadow: inset 0 0 4px rgba(255,255,255,0.4);
  }
`
*/

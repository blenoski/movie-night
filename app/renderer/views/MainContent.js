import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import DisplayMovies from './DisplayMovies'
import Logo from './Logo'

export default ({ dbLoaded, filteredMovies, isCrawling, handleAddMediaClick, movies }) => {
  // Handle application load.
  if (!dbLoaded) {
    return <Splash><Logo /></Splash>
  }

  // Handle first time application started and/or empty database.
  if (movies.length === 0) {
    return (
      <NoMovieStyles>
        Add Media
        <AddMediaButton
          handleClick={handleAddMediaClick}
          busy={isCrawling}
        />
      </NoMovieStyles>
    )
  }

  // Handle no matching search results.
  if (filteredMovies.length === 0) {
    return <NoMovieStyles>No Matches</NoMovieStyles>
  }

  // Normal case. Display movies from database.
  return <DisplayMovies movies={filteredMovies} />
}

const Splash = styled.div`
  align-items: center;
  background-color: rgba(20,20,20,1);
  bottom: 0;
  display: flex;
  font-family: CopperPlate, serif;
  font-size: 400%;
  justify-content: center;
  left: 0;
  padding-bottom: 20%;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
`

const NoMovieStyles = styled(Splash)`
  color: rgba(2,117,216,1);
  flex-direction: column;
  font-size: 3rem;
  z-index: 0;
`

const AddMediaButton = styled(Button)`
  font-size: 10rem;
  padding: 3% 5%;
  text-decoration: none;
`

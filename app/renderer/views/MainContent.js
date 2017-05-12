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
  color: black;
  display: flex;
  font-size: 400%;
  font-family: CopperPlate, serif;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  padding-bottom: 10%;
`

const NoMovieStyles = styled.div`
  align-items: center;
  color: rgba(2,117,216,1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  font-family: CopperPlate, serif;
  font-size: 3rem;
`

const AddMediaButton = styled(Button)`
  font-size: 10rem;
  padding: 3% 5%;
  text-decoration: none;
`

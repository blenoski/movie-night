import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import DisplayMovies from './DisplayMovies'

export default ({ movies, filteredMovies, isCrawling, handleAddMediaClick }) => {
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
  } else if (filteredMovies.length === 0) {
    return <NoMovieStyles>No Matches</NoMovieStyles>
  }

  // Normal case. Display movies from database.
  return <DisplayMovies movies={filteredMovies} />
}

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

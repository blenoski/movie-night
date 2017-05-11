import React, { Component } from 'react'
import styled from 'styled-components'
import AppController from './AppController'
import DisplayMovies from './display-movies'
import ImportMovies from './import-movies'
import Logo from './logo'
import SearchMovies from './search-movies'

export default class App extends Component {
  render () {
    return (
      <Application>
        <Header>
          <Logo />
          <AppControls>
            <SearchMovies />
            <ImportMovies onClick={AppController.importMovies} />
          </AppControls>
        </Header>

        {this.renderContent()}
      </Application>
    )
  }

  renderContent () {
    const movies = this.props.movies || []

    if (movies.length === 0) {
      return (
        <OnFirstRunOrEmptyDatabase>
          Add Media
          <BigImportMovies
            onClick={AppController.importMovies}
          />
        </OnFirstRunOrEmptyDatabase>
      )
    }

    // Normal case. Display movies from database.
    return <DisplayMovies movies={movies} />
  }
}

const Application = styled.div`
  background: rgb(20,20,20);
  padding-top: 40px;
`

const Header = styled.header`
  background-color: rgba(20,20,20,0.7);
  color: white;
  display: flex;
  flex-wrap: nowrap;
  font-family: CopperPlate, Times;
  font-size: 1.5em;
  justify-content: space-between;
  left: 0;
  right: 0;
  top: 0;
  padding: 10px 10px 10px 20px;
  position: fixed;
`

const AppControls = styled.div`
  display: flex;
`

const OnFirstRunOrEmptyDatabase = styled.div`
  align-items: center;
  color: rgba(2,117,216,1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  font-family: CopperPlate, serif;
  font-size: 3rem;
`

const BigImportMovies = styled(ImportMovies)`
  font-size: 10rem;
  padding: 3% 5%;
  text-decoration: none;
`

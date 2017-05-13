import React, { Component } from 'react'
import styled from 'styled-components'
import { ImportMovies, SearchMovies, MainContent } from './controller'
import Logo from './views/Logo'

export default class App extends Component {
  render () {
    return (
      <Application>

        <Header>
          <Logo />
          <AppControls>
            <SearchMovies />
            <ImportMovies />
          </AppControls>
        </Header>

        <MainContent />

      </Application>
    )
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
  z-index: 1;
`

const AppControls = styled.div`
  display: flex;
`

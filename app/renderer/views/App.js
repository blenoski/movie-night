import React from 'react'
import styled from 'styled-components'
import { MainContent } from '../controller'
import Header from './Header'
import Splash from './Splash'

export default (props) => {
  if (!props.dbLoaded) {
    return <Splash />
  }

  return (
    <Application>
      <Header />
      <MainContent />
    </Application>
  )
}

const Application = styled.div`
  background: rgb(20, 20, 20);
  padding-top: 40px;
`

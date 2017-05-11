import React, { Component } from 'react'
import styled from 'styled-components'
import { Database, Spinner } from '../icons'

export default class ImportMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick && !this.props.isCrawling) {
      this.props.onClick()
    }
  }

  render () {
    const { className, isCrawling } = this.props

    if (isCrawling) {
      return <Button className={className}><Spinner pulse /></Button>
    }

    return <HoverButton className={className} onClick={this.onClick}><Database /></HoverButton>
  }
}

const Button = styled.div`
  align-items: center;
  background: none;
  border: 1px solid rgba(2,117,216,1);
  border-radius: 5px;
  color: rgba(2,117,216,1);
  display: flex;
  justify-content: center;
  margin: 1px 0;
  padding: 0 4%;
  font-size: 80%;
`

const HoverButton = styled(Button)`
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: rgba(2, 117, 216, 1);
    color: rgba(255,255,255,0.9);
  }
`

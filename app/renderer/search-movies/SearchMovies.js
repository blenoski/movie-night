import React, { Component } from 'react'
import styled from 'styled-components'
import { TextInput } from '../components'
import { Search } from '../icons'

export default class SearchMovies extends Component {
  constructor (props) {
    super(props)
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this)
  }

  onSearchQueryChange (e) {
    e.preventDefault()
    if (this.props.handleSearchQueryChange) {
      this.props.handleSearchQueryChange(e.target.value)
    }
  }

  render () {
    return (
      <SearchContainer>
        <IconContainer><Search large /></IconContainer>
        <TextInput
          placeholder='Title, genre, actor'
          value={this.props.searchQuery}
          onChange={this.onSearchQueryChange}
        />
      </SearchContainer>
    )
  }
}

const SearchContainer = styled.div`
  display: flex;
  color: white;
  opacity: 0.7;
  margin-right: 10px;
`

const IconContainer = styled.div`
  margin-top: 3px;
  margin-right: 8px;
`

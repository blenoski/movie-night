import React, { Component } from 'react'
import styled from 'styled-components'
import { TextInput } from '../components'
import { Search } from '../icons'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    e.preventDefault()
    if (this.props.handleQueryChange) {
      this.props.handleQueryChange(e.target.value)
    }
  }

  render () {
    return (
      <Bar>
        <SearchIcon large />
        <TextInput
          placeholder='Title, genre, actor'
          value={this.props.searchQuery}
          onChange={this.onChange}
        />
      </Bar>
    )
  }
}

const Bar = styled.div`
  display: flex;
  color: white;
  opacity: 0.7;
  margin-right: 10px;
`

const SearchIcon = styled(Search)`
  margin-top: 7px;
  margin-right: 8px;
`

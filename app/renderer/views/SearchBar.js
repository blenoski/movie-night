import _ from 'underscore'
import React, { Component } from 'react'
import styled from 'styled-components'
import TextInput from './TextInput'
import { Search, Close } from '../icons'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.update = this.update.bind(this)
    this.clear = this.clear.bind(this)
    this.sendDebounced = _.debounce(this.sendDebounced, 250).bind(this)
    this.state = { typing: false, query: '' }
  }

  update (e) {
    e.preventDefault()
    this.setState({ typing: true, query: e.target.value })
    this.sendDebounced()
  }

  clear (e) {
    e.preventDefault()
    this.setState({ typing: false, query: '' })
    if (this.props.handleQueryChange) {
      this.props.handleQueryChange('')
    }
  }

  sendDebounced () {
    if (this.props.handleQueryChange) {
      const text = this.state.query
      this.props.handleQueryChange(text)
      this.setState({ typing: false, query: '' })
    }
  }

  render () {
    return (
      <Bar>
        <SearchIcon large />
        <TextInput
          placeholder='Title, genre, actor'
          value={this.state.typing ? this.state.query : this.props.searchQuery}
          onChange={this.update}
        />
        {this.renderClose()}
      </Bar>
    )
  }

  renderClose () {
    return (this.props.searchQuery)
      ? <span><CloseButton onClick={this.clear} /></span>
      : null
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

const CloseButton = styled(Close)`
  color: rgba(0,0,0,0.5);
  cursor: pointer;
  margin-left: -25px
  padding-top: 6px;
`

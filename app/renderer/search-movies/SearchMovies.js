import React, { Component } from 'react'

class SearchMovies extends Component {
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
      <div style={{display: 'flex', color: 'white', marginRight: '10px'}}>
        <i className='fa fa-search fa-lg' style={{marginTop: '6px', marginRight: '5px'}} />
        <input
          type='text'
          placeholder='Title, genre, actor'
          className='form-control input'
          style={{fontSize: '1rem', marginLeft: '1%'}}
          value={this.props.searchQuery}
          onChange={this.onSearchQueryChange}
        />
      </div>
    )
  }
}

export default SearchMovies

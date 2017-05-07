import React, { Component } from 'react'

class SearchMovies extends Component {
  constructor (props) {
    super(props)
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this)
    this.onSearchCategorySelection = this.onSearchCategorySelection.bind(this)
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this)
    this.state = { showSearchOptions: false }
  }

  onSearchButtonClick (e) {
    e.preventDefault()
    this.setState({showSearchOptions: true})
  }

  onSearchCategorySelection (e) {
    e.preventDefault()
    if (this.props.handleSearchCategoryChange) {
      this.props.handleSearchCategoryChange(e.target.innerText)
    }
    this.setState({showSearchOptions: false})
  }

  onSearchQueryChange (e) {
    e.preventDefault()
    if (this.props.handleSearchQueryChange) {
      this.props.handleSearchQueryChange(e.target.value)
    }
  }

  render () {
    return (
      <div>
        <div style={{display: 'flex', marginTop: '85px'}}>
          {this.renderSearchControls()}
          <input
            type='text'
            className='form-control input-lg'
            value={this.props.searchQuery}
            onChange={this.onSearchQueryChange}
          />
        </div>
      </div>
    )
  }

  renderSearchControls () {
    if (this.state.showSearchOptions) {
      return (
        <div style={{display: 'flex'}}>
          <button className='btn btn-secondary btn-lg' type='button' onClick={this.onSearchCategorySelection}>All</button>
          <button className='btn btn-secondary btn-lg' type='button' onClick={this.onSearchCategorySelection}>Title</button>
          <button className='btn btn-secondary btn-lg' type='button' onClick={this.onSearchCategorySelection}>Genre</button>
          <button className='btn btn-secondary btn-lg' type='button' onClick={this.onSearchCategorySelection}>Actors</button>
        </div>
      )
    }

    return (
      <button
        className='btn btn-outline-primary btn-lg dropdown-toggle'
        type='button'
        onClick={this.onSearchButtonClick}
      >
        Search {this.props.searchCategory}
      </button>
    )
  }
}

export default SearchMovies

import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _ from 'underscore'
import { ImportMovies, SearchMovies, MainContent } from './controller'
import Logo from './views/Logo'
import { updateScrolling } from './model'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { scrolling: false }
    this.onAppScroll = this.onAppScroll.bind(this)
    this.debouncedScrollComplete = _.debounce(this.debouncedScrollComplete, 500).bind(this)
  }

  componentDidMount () {
    // Capture window scroll events
    if (window) {
      window.addEventListener('scroll', this.onAppScroll)
    }
  }

  componentWillUnmount () {
    if (window) {
      window.removeEventListener('scroll', this.onAppScroll)
    }
  }

  onAppScroll (e) {
    e.preventDefault()

    // Update scrolling state but only if we are not already scrolling.
    if (!this.state.scrolling) {
      const { updateScrolling } = this.props
      if (updateScrolling) {
        updateScrolling(true)
        this.setState({ scrolling: true })
      }
    }

    // There is no "finished-scrolling" event, so we will use debounce with
    // a 500ms delay to simulate one.
    this.debouncedScrollComplete()
  }

  debouncedScrollComplete () {
    const { updateScrolling } = this.props
    if (updateScrolling) {
      updateScrolling(false)
      this.setState({ scrolling: false })
    }
  }

  render () {
    return (
      <Application onScroll={this.onAppScroll}>

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

// Wire up dispatch-to-props so we can update state whenever
// the user is scrolling.
function mapDispatchToProps (dispatch) {
  return {
    updateScrolling: (value) => dispatch(updateScrolling(value))
  }
}

// Export the connected component
export default connect(null, mapDispatchToProps)(App)

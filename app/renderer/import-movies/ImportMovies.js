import React, { Component } from 'react'
import { Button } from '../components'
import { Database, Spinner } from '../icons'

class ImportMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    return (
      <Button primary outline
        onClick={this.onClick}
        disabled={this.props.isCrawling}
      >
        {this.renderIcon()}
      </Button>
    )
  }

  renderIcon () {
    if (this.props.isCrawling) {
      return <Spinner fixedWidth large pulse />
    } else {
      return <Database />
    }
  }
}

export default ImportMovies

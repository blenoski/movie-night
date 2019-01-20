import fs from 'fs'
import React, { Component } from 'react'
import styled from 'styled-components'
import { shell } from 'electron'

import { fileExists, filePathToUrl } from '../../../../shared/utils'
import { fetchMovieMetadata } from '../../../../background/api/fetchMovieMetadata';
import { Close } from '../../../icons'

import ListMeta from './ListMeta'
import Location from './Location'
import Meta from './Meta'
import PlayMovieButton from './PlayMovieButton'
import Ratings from './Ratings'
import Title from './Title'
import Update from './Update';

export default class MovieDetail extends Component {
  constructor (props) {
    super(props)
    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.showMovieInFinder = this.showMovieInFinder.bind(this)
    this.updateFileAvailable = this.updateFileAvailable.bind(this)
    this.close = this.close.bind(this)
    this.handleRedoSearch = this.handleRedoSearch.bind(this)
    this.handleSaveSearch = this.handleSaveSearch.bind(this)
    this.anchor = null

    this.state = {
      fileAvailable: true,
      searching: false,
      searchError: '',
      searchMovieResult: null
    }
  }

  componentDidMount () {
    this.props.center &&
    this.anchor &&
    this.anchor.scrollIntoViewIfNeeded() // centers anchor in viewport

    this.updateFileAvailable()
    fs.watchFile(this.props.movie.fileInfo[0].location, this.updateFileAvailable)
  }

  componentWillUnmount () {
    fs.unwatchFile(this.props.movie.fileInfo[0].location, this.updateFileAvailable)
  }

  updateFileAvailable () {
    fileExists(this.props.movie.fileInfo[0].location)
      .then(result => this.setState({ fileAvailable: result }))
  }

  openMovieInDefaultPlayer (e) {
    e.preventDefault()
    const { movie } = this.props
    shell.openItem(movie.fileInfo[0].location)
  }

  showMovieInFinder (e) {
    e.preventDefault()
    const { movie } = this.props

    shell.showItemInFolder(movie.fileInfo[0].location)
  }

  close (e) {
    e.preventDefault()
    const { movie, handleCloseMovieDetails } = this.props
    if (handleCloseMovieDetails) {
      handleCloseMovieDetails(movie)
    }
  }

  handleRedoSearch (searchTitle, searchYear) {
    const { movie } = this.props;
    this.setState({ searching: true });

    const movieFile = searchTitle + (searchYear ? ` [${searchYear}]` : '');

    fetchMovieMetadata(movieFile)
      .then(response => {
        const searchMovieResult = {
          ...response,
          fileInfo: [
            {
              location: movie.fileInfo[0].location,
              query: `&s=${searchTitle}&y=${searchYear}`
            }
          ]
        }
        this.setState({
          searching: false,
          searchMovieResult,
          searchError: ''
        })
      })
      .catch(error => {
        this.setState({
          searching: false,
          searchMovieResult: null,
          searchError: `Search Error: No result`
        })
      })
  }

  handleSaveSearch () {
    const { onUpdateMovieMetadata } = this.props;
    const { searchMovieResult } = this.state;

    if (searchMovieResult) {
      onUpdateMovieMetadata(searchMovieResult);
    }
  }

  render () {
    const { movie: dbMovie } = this.props
    const { searching, searchError, searchMovieResult } = this.state;

    const movie = searchMovieResult || dbMovie;

    const posterUrl = searchMovieResult
      ? searchMovieResult.imgUrl
      : (movie.imgFile ? filePathToUrl(movie.imgFile) : '')

    return (
      <FlexboxDiv >
        <button /* Hook for scrolling top of div to center of viewport */
          ref={(node) => { if (node) this.anchor = node }}
          style={{visibility: 'hidden'}}
        />

        <Poster fileUrl={posterUrl}>
          {this.state.fileAvailable && <PlayMovieButton onClick={this.openMovieInDefaultPlayer} />}
        </Poster>

        <MovieDetailsContainer>
          <header>
            <Div>
              <Title title={movie.title} />
              <CloseButton onClick={this.close} />
            </Div>
            <Meta year={movie.year} rated={movie.rated} runtime={movie.runtime} />
            <Ratings
              audience={Number(movie.imdbRating) / 10.0}
              critics={Number(movie.metascore) / 100.0}
            />
          </header>

          <VerticalScrollSection>
            {movie.plot}
          </VerticalScrollSection>

          <ListMeta
            actors={movie.actors}
            director={movie.director}
            genres={movie.genres}
          />

          <Location
            location={movie.fileInfo[0].location}
            handleClick={this.showMovieInFinder}
            fileExists={this.state.fileAvailable}
          />

          <Update
            onRedoSearch={this.handleRedoSearch}
            onSaveSearch={searchMovieResult ? this.handleSaveSearch : undefined}
            searchInfo={movie.fileInfo[0]}
            searching={searching}
            searchError={searchError}
          />
        </MovieDetailsContainer>

      </FlexboxDiv>
    )
  }
}

const FlexboxDiv = styled.div`
  display: flex;
  margin-top: 20px;
`
const Div = styled.div`
  display: flex;
  justify-content: space-between;
`

const CloseButton = styled(Close)`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 30px;
  padding: 5px 0 0;
`

const Poster = styled.aside`
  align-items: center;
  background: ${props => `url(${props.fileUrl}) no-repeat center`};
  display: flex;
  flex-shrink: 0;
  height: 444px;
  justify-content: center;
  margin-right: 20px;
  width: 300px;

  ${props => !props.fileUrl && `
    border: 1px solid #999;
  `}
`

const MovieDetailsContainer = styled.article`
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  height: 444px;
  min-width: 500px;
  max-width: 600px;
`

const VerticalScrollSection = styled.section`
  margin-top: 20px;
  overflow-y: auto;
`

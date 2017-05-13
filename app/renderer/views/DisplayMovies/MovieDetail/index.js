import React, { Component } from 'react'
import styled from 'styled-components'
import { shell } from 'electron'
import ListMeta from './ListMeta'
import Location from './Location'
import Meta from './Meta'
import PlayMovieButton from './PlayMovieButton'
import Ratings from './Ratings'
import Title from './Title'
import { Close } from '../../../icons'

export default class MovieDetail extends Component {
  constructor (props) {
    super(props)
    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.showMovieInFinder = this.showMovieInFinder.bind(this)
    this.close = this.close.bind(this)
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
    const { handleCloseMovieDetails } = this.props
    if (handleCloseMovieDetails) {
      handleCloseMovieDetails()
    }
  }

  render () {
    const { movie } = this.props

    return (
      <FlexboxDiv>

        <Poster imgFile={movie.imgFile}>
          <PlayMovieButton onClick={this.openMovieInDefaultPlayer} />
        </Poster>

        <MovieDetailsContainer>
          <header>
            <Title title={movie.title} />
            <Meta year={movie.year} rated={movie.rated} runtime={movie.runtime} />
            <Ratings
              audience={Number(movie.imdbRating) / 10.0}
              critics={Number(movie.metascore) / 100.0}
            />
          </header>

          <VerticalScrollSection>{movie.plot}</VerticalScrollSection>

          <ListMeta
            actors={movie.actors}
            director={movie.director}
            genres={movie.genres}
          />

          <Location
            location={movie.fileInfo[0].location}
            handleClick={this.showMovieInFinder}
          />
        </MovieDetailsContainer>

        <CloseButton onClick={this.close} />

      </FlexboxDiv>
    )
  }
}

const FlexboxDiv = styled.div`
  display: flex;
  position: relative;
`

const CloseButton = styled(Close)`
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  font-size: 30px;
  position: abolute;
  right: 0;
  padding: 0 15px 0 0;
`

const Poster = styled.aside`
  align-items: center;
  background: ${props => `url(${props.imgFile}) no-repeat center`};
  display: flex;
  flexShrink: 0;
  height: 444px;
  justify-content: center;
  margin-right: 20px;
  width: 300px;
`

const MovieDetailsContainer = styled.article`
  color: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  height: 444px;
`

const VerticalScrollSection = styled.section`
  margin-top: 30px;
  overflow-y: auto;
`

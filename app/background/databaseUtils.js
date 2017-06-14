'use strict'
import _ from 'underscore'

// HOF used in conjunction with db.findOne() to search for a movie
export function movieWithAnyLocationMatching (movieFile) {
  const filter = (document) => {
    for (let item of document.fileInfo) {
      if (item.location === movieFile) {
        return true
      }
    }
    return false
  }
  return filter
}

// Conflate a new movie with existing database document.
export function conflate (document, movie) {
  // Early return if document is currently null, i.e., not in database.
  if (!document) {
    return { documentChanged: true, finalDocument: movie }
  }

  // Currently only checking for new locations
  const duplicateLocation = document.fileInfo.find((info) => {
    return info.location === movie.fileInfo[0].location
  })
  if (!duplicateLocation) {
    let finalDoc = JSON.parse(JSON.stringify(document))
    finalDoc.fileInfo.push(movie.fileInfo[0])
    return { documentChanged: true, finalDocument: finalDoc }
  } else {
    return { documentChanged: false, finalDocument: document }
  }
}

// Partitions movies by primary Genre and sorts the
// partitions from most to least movies.
export function paritionMovieDatabaseByGenre (movieDB) {
  // Partition movies by primary genre.
  const genreMap = _.groupBy(movieDB, (movie) => movie.genres[0])
  return Object.keys(genreMap).map(genre => {
    return { // Move movies with no poster image to back of genre array.
      genre,
      movies: _.flatten(_.partition(genreMap[genre], (movie) => movie.imgFile))
    }
  }).sort((lhs, rhs) => { // sort by genre from most movies to least movies
    return rhs.movies.length - lhs.movies.length
  })
}

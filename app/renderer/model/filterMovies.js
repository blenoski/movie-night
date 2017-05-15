// WARNING: Performance really matters inside this module.
// Execution happens in real time as user is typing search query and/or
// as movies are added to the database. Execution is currently blocking to
// allow for real-time search results. Could make async at the expense of needing
// a spinner for search results and logic for what happens when movies get added
// to database at the same time search query is being updated. Make sure to keep
// the algorithm O(n) and only iterate through the entire database once.

export default function (searchQuery, movies) {
  searchQuery = searchQuery.toLowerCase().trim()

  // TODO: Movie this work to background thread minus the search filter.
  // I.e. movies should come into render thread already indexed by genre and sorted.
  // Loop over movies, filter on search query and partition into genres.
  let genreMap = {}
  let noPosters = []
  let moviesLength = movies.length
  for (let i = 0; i < moviesLength; i += 1) {
    const movie = movies[i]
    if (!searchQuery || searchFilterIncludes(movie, searchQuery)) {
      if (movie.imgFile) {
        const genre = movie.genres[0]
        let items = genreMap[genre]
        items ? items.push(movie) : genreMap[genre] = [movie]
      } else {
        noPosters.push(movie)
      }
    }
  }

  // Push movies with no poster to end of genre array.
  // Assumption is this array will be small.
  for (let j = 0; j < noPosters.length; j += 1) {
    const movie = noPosters[j]
    const genre = movie.genres[0]
    let items = genreMap[genre]
    items ? items.push(movie) : genreMap[genre] = [movie]
  }

  // Order by genre from most movies to least movies.
  return Object.keys(genreMap).sort((lhs, rhs) => {
    const countRhs = genreMap[rhs].length
    const countLhs = genreMap[lhs].length
    return countRhs - countLhs
  }).map(genre => {
    return { genre, movies: genreMap[genre] }
  })
}

function searchFilterIncludes (movie, query) {
  // Look for matching title
  if (movie.title.toLowerCase().indexOf(query) >= 0) {
    return true
  }

  // Look for matching genre.
  // Here we only consider the first/primary genre and
  // we are looking for a startsWith match.
  if (movie.genres[0].startsWith(query)) {
    return true
  }

  // Look for matching actor. Use traditional for loop for performance.
  const actors = movie.actors
  let actorsLength = actors.length
  for (let j = 0; j < actorsLength; j += 1) {
    if (actors[j].indexOf(query) >= 0) {
      return true
    }
  }

  // Look for matching director.
  if (movie.director.toLowerCase().indexOf(query) >= 0) {
    return true
  }

  return false
}

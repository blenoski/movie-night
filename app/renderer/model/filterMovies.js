// WARNING: Performance really matters inside this module.
// Execution happens in real time as user is typing search query and/or
// as movies are added to the database. Execution is currently blocking to
// allow for real-time search results. Could make async at the expense of needing
// a spinner for search results and logic for what happens when movies get added
// to database at the same time search query is being updated. Make sure to keep
// the algorithm O(n) and only iterate through the entire database once.

export default function (searchCategory, searchQuery, movies) {
  searchQuery = searchQuery.toLowerCase().trim()
  if (!searchCategory && !searchQuery) {
    return movies
  }

  // Filter on search category first
  let moviesMatchingCategory = searchCategory
    ? movies.filter(category => category.genre === searchCategory)
    : movies

  if (!searchQuery) {
    return moviesMatchingCategory
  }

  // Then on search query
  let filteredMovies = []
  moviesMatchingCategory.forEach(genre => {
    const genreName = genre.genre
    filteredMovies.push({ genre: genreName, movies: [] })
    const index = filteredMovies.length - 1

    // If search query includes genre, then include ALL movies in genres
    if (genreName.includes(searchQuery)) {
      filteredMovies[index].movies = genre.movies
    } else { // Else loop over movies in genre and check if search query applies
      filteredMovies[index].movies =
        genre.movies.filter(movie => searchFilterIncludes(movie, searchQuery))
    }
  })

  // Get rid of empty genres.
  return filteredMovies.filter(category => category.movies.length > 0)
}

function searchFilterIncludes (movie, query) {
  // Look for matching title
  if (movie.title.toLowerCase().indexOf(query) >= 0) {
    return true
  }

  // Look for matching director.
  if (movie.director.toLowerCase().indexOf(query) >= 0) {
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

  return false
}

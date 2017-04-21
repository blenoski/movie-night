const path = require('path')

module.exports = {
  // Movie file names are often decorated with metadata that will cause
  // online searches to fail. Try and strip out anything that looks like metadata.
  // Here we will return an array of search queries ranked in order of search preference.
  generateSearchQueriesFor: function generateSearchQueriesFor (movieFile) {
    const { name } = path.parse(movieFile)

    // Compute search queries from file name.
    let queries = generateQueriesFor(name)

    // Compute search queries from parent directory name
    // If and only if:
    //  - movie file's directory has no subdirs AND
    //  - movie file's directory has only 1 movie file
    return queries
  }
}

// Generates the query objects for a given name.
function generateQueriesFor (name) {
  // Extract potential release years from name.
  let releaseYears = name.split(/[\D]/).filter((str) => {
    const year = Number(str)
    return year >= 1900 && year <= 2099
  })

  // Extract potential title strings.
  let titles = getTitlesFor(name)

  // Conflate release year and title into query objects
  // Titles can also be considered standalone but titles with year are preferred.
  let queries = []

  titles.forEach((title) => {
    releaseYears.forEach((releaseYear) => {
      queries.push({ title, releaseYear })
    })
    queries.push({ title })
  })

  return queries
}

// Returns an array of potential titles given a dirty name.
function getTitlesFor (name) {
  const cleanName = clean(normalize(name))
  let titles = [ cleanName ]

  // Chop words off end of cleanName one by one to create alt title strings
  let choppedName = cleanName
  while (choppedName.lastIndexOf(' ') > -1) {
    choppedName = choppedName.substring(0, choppedName.lastIndexOf(' '))
    titles.push(choppedName)
  }

  // If last remaining word is camel cased, split it.
  let splitName = choppedName.replace(/([a-z|0-9])([A-Z])/g, '$1 $2')
  if (splitName !== choppedName) {
    titles.push(splitName)
  }

  return titles
}

// Replace periods, underscores, and dashes with spaces.
function normalize (name) {
  return name.replace(/\./g, ' ') // replace periods with spaces
    .replace(/_/g, ' ') // replace underscores with spaces
    .replace(/-/g, ' ') // replace dashes with spaces
    .trim()
}

// Delete anything that looks like metadata encoded in the title.
// As soon as we find metadata, we delete everything following it.
function clean (name) {
  return name.replace(/\(.*?\).*/, '') // text in parens
    .replace(/\[.*?\].*/, '') // text in brackets
    .replace(/{.*?}.*/, '') // text in curly braces
    .replace(/1080p.*/i, '')
    .replace(/720p.*/i, '')
    .replace(/480p.*/i, '')
    .replace(/aac.*/i, '')
    .replace(/ac3.*/i, '')
    .replace(/axxo.*/i, '')
    .replace(/blueray.*/i, '')
    .replace(/bluray.*/i, '')
    .replace(/brrip.*/i, '')
    .replace(/cm8.*/i, '')
    .replace(/dmt.*/i, '')
    .replace(/dvdrip.*/i, '')
    .replace(/dvdsrc.*/i, '')
    .replace(/dvd.*/i, '') // keep this below dvdrip and dvdsrc
    .replace(/etrg.*/i, '')
    .replace(/fxg.*/i, '')
    .replace(/h264.*/i, '')
    .replace(/hdrip.*/i, '')
    .replace(/hdtv.*/i, '')
    .replace(/jaybob.*/i, '')
    .replace(/juggs.*/i, '')
    .replace(/mkv.*/i, '')
    .replace(/mp3.*/i, '')
    .replace(/nl subs.*/i, '')
    .replace(/no1knows.*/i, '')
    .replace(/subforced.*/i, '')
    .replace(/tnb.*/i, '')
    .replace(/torentz.*/i, '')
    .replace(/torent.*/i, '')
    .replace(/torrent.*/i, '')
    .replace(/web-dl.*/i, '')
    .replace(/webrip.*/i, '')
    .replace(/x264.*/i, '')
    .replace(/xvid.*/i, '')
    .replace(/yify.*/i, '')
    .trim() // remove all leading and trailing whitespace after cleaning
}

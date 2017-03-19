import React from 'react'
import { connect } from 'react-redux'

const SearchDirectory = (props) => {
  return (
    <div>
      <input
        type='text'
        className='form-control input-lg'
        value={props.searchDir}
      />
    </div>
  )
}

function mapStateToProps (state) {
  return { searchDir: state.searchDir }
}

export default connect(mapStateToProps)(SearchDirectory)

import React from 'react'

const Logo = () => {
  return (
    <div className='logo' style={{flexShrink: '0', color: '#0275d8'}}>
      <span style={{textDecoration: 'underline'}}>Movie</span>
      <i className='fa fa-anchor fa-lg' style={{margin: '0 5px'}} />
      <span style={{textDecoration: 'underline'}}>Night</span>
    </div>
  )
}

export default Logo

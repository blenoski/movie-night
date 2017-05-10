import cn from 'classnames'
import React from 'react'

const Icon = ({ className, fixedWidth, large, pulse, ...props }) => {
  return <i
    className={cn(
      'fa',
      className,
      pulse && 'fa-pulse',
      large && 'fa-lg',
      fixedWidth && 'fa-fw'
    )}
    {...props}
  />
}

export const Anchor = ({ className, ...props }) => {
  return <Icon className='fa-anchor' {...props} />
}

export const Database = ({ className, ...props }) => {
  return <Icon className='fa-database' {...props} />
}

export const Search = ({ className, ...props }) => {
  return <Icon className='fa-search' {...props} />
}

export const Spinner = ({ className, ...props }) => {
  return <Icon className='fa-spinner' {...props} />
}

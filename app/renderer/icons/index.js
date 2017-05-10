import cn from 'classnames'
import React from 'react'

const Icon = ({ className, large, ...props }) => {
  return <i
    className={cn(
      'fa',
      className,
      large && 'fa-lg'
    )}
    {...props}
  />
}

export const Anchor = ({ className, ...props }) => {
  return <Icon
    className={cn(
      'fa-anchor',
      className
    )}
    {...props}
  />
}

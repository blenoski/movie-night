import cn from 'classnames'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export const TextInput = ({className, ...props}) => {
  return <input
    type='text'
    className={cn(
      'form-control input',
      className
    )}
    {...props}
  />
}

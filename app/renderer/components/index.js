import cn from 'classnames'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export const Button = ({className, outline, primary, ...props}) => {
  return <button
    type='button'
    className={cn(
      'btn',
      primary && !outline && 'btn-primary',
      primary && outline && 'btn-outline-primary',
      className
    )}
    {...props}
  />
}

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

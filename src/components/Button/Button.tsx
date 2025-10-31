import { Button as AriaButton } from 'react-aria-components'
import type { ButtonProps as AriaButtonProps } from 'react-aria-components'
import { Link, type LinkProps } from 'react-router-dom'
import { forwardRef, type ReactNode } from 'react'
import styles from './Button.module.scss'

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'children'> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'small' | 'medium' | 'large'
  isFullWidth?: boolean
  className?: string
  href?: string // URL for link functionality
  external?: boolean // If true, opens in new tab (for external links)
  children: ReactNode // Simplified children type
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'medium',
    isFullWidth = false,
    className = '',
    href,
    external = false,
    children,
    ...props
  }, ref) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      isFullWidth && styles.fullWidth,
      className
    ].filter(Boolean).join(' ')

    // If href is provided, render as Link or external anchor
    if (href) {
      // External link (opens in new tab)
      if (external) {
        return (
          <a
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            href={href}
            className={buttonClasses}
            target="_blank"
            rel="noopener noreferrer"
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        )
      }

      // Internal link using React Router
      return (
        <Link
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          to={href}
          className={buttonClasses}
          {...(props as Omit<LinkProps, 'to' | 'className'>)}
        >
          {children}
        </Link>
      )
    }

    // Default button behavior
    return (
      <AriaButton
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        className={buttonClasses}
        {...(props as AriaButtonProps)}
      >
        {children}
      </AriaButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
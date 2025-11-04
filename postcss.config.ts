import postcssJitProps from 'postcss-jit-props'
import OpenProps from 'open-props'

export default {
  plugins: [
    // Only include Open Props custom properties that are actually used in your code
    // This dramatically reduces the CSS output size
    postcssJitProps(OpenProps)
  ]
}

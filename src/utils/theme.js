/**
 * @description Get user preference from localStorage
 * @returns {string} 'dark' | 'light'
 */
export function getTheme() {
  const theme = localStorage.getItem('theme')
  return theme
}

/**
 * @description Get system preference
 * @returns {string} 'dark' | 'light'
 */
export function getPrefersColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
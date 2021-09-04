/**
 * A collection of function for localStorage management
 */

/**
 * Sets default values for localStorage
 */
export function setDefaultStorageValues() {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenSelector')
  localStorage.welcomeScreenShown = 'false'
  localStorage.hiddenLeftPanelVisible = 'true'
}
/**
 * Checks for CSRF token in cookies
 * @returns boolean
 */
export const getCsrfTokenMatch = () => {
	return document.cookie.match(/csrftoken=([^;]+)/);
}
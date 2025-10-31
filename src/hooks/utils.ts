/**
 * A function to get the device name of the user's device.
 * @returns {string} the Device Name for the User
 */
export const getDeviceName = (): string => {
	const userAgent = navigator.userAgent;
	const platform = navigator.platform;

	// iOS devices
	if (/iPad/.test(userAgent)) return 'iPad';
	if (/iPhone/.test(userAgent)) return 'iPhone';
	if (/iPod/.test(userAgent)) return 'iPod';

	// Android devices
	if (/Android/.test(userAgent)) {
		const match = userAgent.match(/Android\s([0-9.]+)/);
		return match ? `Android ${match[1]}` : 'Android Device';
	}

	// Desktop platforms
	if (/Mac/.test(platform)) return 'Mac';
	if (/Win/.test(platform)) return 'Windows PC';
	if (/Linux/.test(platform)) return 'Linux PC';

	// Check for tablet patterns
	if (/Tablet|PlayBook/i.test(userAgent)) return 'Tablet';

	// Mobile fallback
	if (/Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
		return 'Mobile Device';
	}

	// Desktop fallback
	return 'Desktop Computer';
};
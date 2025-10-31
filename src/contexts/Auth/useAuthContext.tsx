import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 *  The context hook which is exposed to be used in the app to maintain one way authentication
 * @returns
 */
export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
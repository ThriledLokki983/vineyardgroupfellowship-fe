import { createContext } from 'react';
import type { User } from '../../configs/hooks-interfaces';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 *  Auth context type definition
 * 	Here we provide the type definition for all teh functions available for this context that can be accessed
 *  This helps to prevent wrong usage of any function or primitive that is accessed from this context
 */
export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string, rememberMe?: boolean, deviceName?: string) => Promise<void>;
	logout: () => Promise<void>;
	getAccessToken: () => string | null;
	setAccessToken: (token: string) => void;
	setUser: (user: User) => void;
	refreshAccessToken: (silentFail?: boolean) => Promise<string | null>;
}
import React from 'react';
import DOMPurify from 'dompurify';
import type { PasswordStrengthState } from '../types/utils';

export const calculatePasswordStrength = (password: string): PasswordStrengthState => {
  if (!password || password.length === 0) {
    return {
      score: 0,
      strength: 'very-weak',
      feedback: 'Enter a password',
      percentage: 0
    };
  }

  let score = 0;
  const maxScore = 10;
  let feedback = '';
  const errors: string[] = [];

  // Length check (0-2 points) - MINIMUM 12 REQUIRED
  if (password.length < 12) {
    errors.push('Must be at least 12 characters');
    score = 0; // Auto-fail if less than 12
  } else if (password.length >= 12) {
    score += 2;
  }

  // Character variety checks - ALL REQUIRED (not optional!)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (hasLower) {
    score += 1;
  } else {
    errors.push('Must contain lowercase letter');
  }

  if (hasUpper) {
    score += 1;
  } else {
    errors.push('Must contain uppercase letter');
  }

  if (hasDigit) {
    score += 1;
  } else {
    errors.push('Must contain a number');
  }

  if (hasSpecial) {
    score += 2;
  } else {
    errors.push('Must contain special character');
  }

  // Common patterns check - partial match detection
  const commonPatterns = [
    'password', 'admin', 'user', 'login', 'welcome',
    '123456', 'qwerty', 'abc123', 'password123'
  ];

  const passwordLower = password.toLowerCase();
  const hasCommonPattern = commonPatterns.some(pattern =>
    passwordLower.includes(pattern)
  );

  if (hasCommonPattern) {
    errors.push('Contains common pattern');
    score = Math.max(0, score - 2);
  }

  // Repeated characters penalty
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Avoid repeated characters');
    score = Math.max(0, score - 1);
  }

  // Numeric-only password check
  if (/^\d+$/.test(password)) {
    errors.push('Cannot be entirely numeric');
    score = 0;
  }

  // Calculate final score and strength
  const finalScore = Math.max(0, Math.min(maxScore, score));
  const percentage = (finalScore / maxScore) * 100;

  // Strength levels matching backend (0-10 scale)
  let strength: PasswordStrengthState['strength'];

  if (finalScore >= 8) {
    strength = 'very-strong';
    feedback = 'Excellent password!';
  } else if (finalScore >= 6) {
    strength = 'strong';
    feedback = 'Strong password';
  } else if (finalScore >= 4) {
    strength = 'fair';
    feedback = 'Fair - could be stronger';
  } else if (finalScore >= 2) {
    strength = 'weak';
    feedback = 'Weak - needs improvement';
  } else {
    strength = 'very-weak';
    feedback = 'Very weak';
  }

  // If there are errors, show the first one as primary feedback
  if (errors.length > 0) {
    feedback = errors[0];
  }

  return {
    score: finalScore,
    strength,
    feedback,
    percentage,
    errors // Include this so you can show all validation errors
  };
};

// Fallback parseJson if @grrr/utils is not available
const parseJson = (value: string | null): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

interface ProfileData {
  first_name?: string;
  last_name?: string;
  email: string;
  initials?: string;
  [key: string]: unknown;
}

/**
 * Compose initials from email.
 */
export const composeInitialsFromEmail = (email: string): string => {
  const parts = email.split('@')[0].split('.') || [];
  const firstPart = parts.at(0);
  const lastPart = parts.at(-1);
  return ((firstPart?.at(0) || '') + (lastPart?.at(0) || '')).toUpperCase();
};

/**
 * Compose normalize name, since backend / Azure production returns `(NL)` included
 * in the default `name` property.
 */
export const normalizeName = (p: ProfileData): string =>
  [p.first_name, p.last_name].join(' ').trim();

/**
 * Normalize profile/attendee API endpoint response data.
 */
export const normalizeFetchedProfile = (data: ProfileData): ProfileData => ({
  ...data,
  name: normalizeName(data),
  initials: data.initials || composeInitialsFromEmail(data.email),
  email: data.email.toLowerCase(),
  // @TODO: attendee specific, maybe refactor to proxy wrapper?
  // type_label: composeAttendeeTypeLabel(data),
});

/**
 * Convert to integer.
 */
export const int = (value: string | number): number => parseInt(String(value), 10);

/**
 * Arrow key identifiers.
 */
export const isLeftKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'ArrowLeft') || e.keyCode === 37;
export const isUpKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'ArrowUp') || e.keyCode === 38;
export const isRightKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'ArrowRight') || e.keyCode === 39;
export const isDownKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'ArrowDown') || e.keyCode === 40;

export const isSpaceKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === ' ') || e.keyCode === 32;
export const isEnterKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'Enter') || e.keyCode === 13;
export const isEscapeKey = (e: KeyboardEvent | React.KeyboardEvent): boolean =>
  (e.key && e.key === 'Escape') || e.keyCode === 27;

/**
 * Sanitize HTML content.
 */
export const sanitize = (value: string): string => DOMPurify.sanitize(value);

/**
 * New line to breaks (equal to `nl2br` in PHP).
 */
export const nl2br = (value: string): string => {
  const sanitized = sanitize(value);
  return sanitized?.replace(/(?:\r\n|\r|\n)/g, '<br/>');
};

/**
 * Highlight string matches in search queries.
 */
export const highlight = (content: string, query: string): string => {
  if (!query) {
    return content;
  }
  const regex = new RegExp(query.split(' ').join('|'), "ig");
  const sanitized = sanitize(content);
  return sanitized.replace(regex, '<mark>$&</mark>');
};

/**
 * Clamp numbers.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Check if number is even or odd.
 */
export const isEven = (value: number): boolean => value % 2 === 0;
export const isOdd = (value: number): boolean => Math.abs(value % 2) === 1;

/**
 * Basic storage helpers.
 */
export const store = (key: string, value: unknown, { permanent = false } = {}): void => {
  if (!key) {
    return;
  }
  const storage = permanent ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(value));
};

export const restore = (key: string, { permanent = false } = {}): unknown => {
  const storage = permanent ? localStorage : sessionStorage;
  return parseJson(storage.getItem(key));
};

export const remove = (key: string, { permanent = false } = {}): void => {
  const storage = permanent ? localStorage : sessionStorage;
  storage.removeItem(key);
};

/**
 * Scroll to top.
 */
export const scrollToTop = (instant?: boolean): void => window.scrollTo({
  top: 0,
  behavior: instant ? 'instant' : 'smooth',
});

/**
 * Set input value, which is a bit different in React.
 * See: https://stackoverflow.com/a/46012210
 */
export const setReactInputValue = (input: HTMLInputElement, value: string): void => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(input, value);
};

/**
 * Strip trailing slashes.
 */
export const stripTrailingSlash = (path: string): string => path.replace(/\/$/g, '');

/**
 * Prefers reduced motion.
 */
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

/**
 * Add days to a Date.
 */
export const addDaysToDate = (date: Date, days: number = 0): Date => {
  const clone = new Date(date.valueOf());
  clone.setDate(date.getDate() + days);
  return clone;
};

/**
 * Convert Date to ISO 8601 date string (omitting time and timezone).
 * Output: 2023-02-20
 */
export const dateToIsoString = (date: Date): string => date.toISOString().split("T")[0];

/**
 * Converts a UTC timestamp to a `Intl.RelativeTimeFormat` label.
 */
export const getElapsedRelativeTimeLabel = (date: string): string => {
  if (!date) {
    return '';
  }

  // Get minutes integer, leaving timezone intact (Django saves as `Europe/Amsterdam`).
  const minutes = Math.round((Date.parse(date) - Date.now()) / (1000 * 60));

  // Format based on amount of minutes.
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  // Years: more than 1.5 years ago.
  if (minutes < -(60 * 24 * 365 * 1.5)) {
    return formatter.format(Math.round(minutes / (60 * 24 * 365.25)), 'year');
  }
  // Days: more than 1.5 days ago.
  if (minutes < -(60 * 24 * 1.5)) {
    return formatter.format(Math.round(minutes / (60 * 24)), 'day');
  }
  // Minutes: less than 1.5 hours ago.
  if (minutes > -(60 * 1.5)) {
    return formatter.format(minutes, 'minute');
  }
  // Hours: default.
  return formatter.format(Math.round(minutes / 60), 'hour');
};

/**
 * Converts amount of minutes to relative time.
 */
export const getRelativeTimeLabel = (minutes: number): string => {
  if (!minutes) {
    return '';
  }

  // Years: more than 1.5 years.
  if (minutes > (60 * 24 * 365 * 1.5)) {
    return `${Math.round(minutes / (60 * 24 * 365.25))} years`;
  }
  // Days: more than 1.5 days.
  if (minutes > (60 * 24 * 1.5)) {
    return `${Math.round(minutes / (60 * 24))} days`;
  }
  // Minutes: less than 1.5 hours.
  if (minutes < (60 * 1.5)) {
    const rounded = Math.round(minutes);
    return `${rounded} minute${rounded === 1 ? `` : `s`}`;
  }
  // Hours: default.
  return `${Math.round(minutes / 60)} hours`;
};

const isYears = (value: number): boolean => value < -(60 * 24 * 365 * 1.5);
const isDays = (value: number): boolean => value < -(60 * 24 * 1.5);
const isMinutes = (value: number): boolean => value > -(60 * 1.5);

interface RelativeTimeResult {
  value: number;
  label: string;
}

/**
 * Converts dates to relative time.
 */
export const getRelativeTime = (
  date: string,
  { includeTime = false } = {}
): number | string | RelativeTimeResult => {
  if (!date) {
    return '';
  }

  // Get minutes integer, leaving timezone intact (Django saves as `Europe/Amsterdam`).
  const minutes = Math.round((Date.parse(date) - Date.now()) / (1000 * 60));

  if (includeTime) {
    // years
    if (isYears(minutes)) {
      return Math.round(minutes / (60 * 24 * 365.25));
    }

    // days
    if (isDays(minutes)) {
      return Math.round(minutes / (60 * 24));
    }

    // minutes
    if (isMinutes(minutes)) {
      return Math.abs(minutes);
    }

    // hours
    return Math.round(minutes / 60);
  }

  // Years: more than 1.5 years ago.
  if (isYears(minutes)) {
    return {value: Math.abs(Math.round(minutes / (60 * 24 * 365.25))), label: 'years'};
  }
  // Days: more than 1.5 days ago.
  if (isDays(minutes)) {
    return {value: Math.abs(Math.round(minutes / (60 * 24))), label: 'days'};
  }
  // Minutes: less than 1.5 hours ago.
  if (isMinutes(minutes)) {
    return {value: Math.abs(minutes), label: `minute${Math.abs(minutes) <= 1 ? `` : `s`}`};
  }
  // Hours: default.
  return {value: Math.abs(Math.round(minutes / 60)), label: 'hours'};
};

/**
 * Compose image URL (could be either a path, Base64 or a Blob).
 */
export const normalizeImageUrl = (value: string | Blob = ''): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    if (value.startsWith("http") || value.startsWith("/")) {
      return value;
    }
    if (value.startsWith("b'")) {
      return value
        ?.replace(`b'`, `data:image/jpeg;base64,`)
        ?.replace(`'`, ``);
    }
    if (value.includes("base64")) {
      return value;
    }
    return '';
  }
  const url = window.URL || window.webkitURL;
  return url.createObjectURL(value);
};

interface BreakpointValues {
  [key: string]: number;
}

/**
 * Get CSS breakpoint values from CSS variables.
 */
export const getBreakpointValues = (sizes: string[]): BreakpointValues => sizes.reduce(
  (acc, size) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--breakpoint-${size}`);
    return {
      ...acc,
      [size]: int(value),
    };
  },
  {} as BreakpointValues
);

/**
 * Check if a breakpoint matches the current width.
 * Note: `window.innerWidth` is full width, `clientWidth` excludes visible scrollbar.
 */
export const matchesBreakpoint = (size: number): boolean =>
  (window.innerWidth || document.documentElement.clientWidth) >= size;

/**
 * Get array with matching breakpoint names.
 */
export const getMatchingBreakpoints = (sizes: BreakpointValues): string[] => {
  return Object.entries(sizes)
    .filter(([, size]) => matchesBreakpoint(size))
    .map(([name]) => name);
};

/**
 * Taking a dateString - return it in a format like 09:00
 * @param dateString
 * @returns {string}
 */
export const extractTimeFromDateString = (dateString: string): string => {
  const date = new Date(dateString);

  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();

  if(hours < 10) hours = '0' + hours;
  if(minutes < 10) minutes = '0' + minutes;

  return hours + ':' + minutes;
};

interface DataWithUpdatedAt {
  updated_at: string;
}

/**
 * A function that takes a data and check if its updated_at field is less than 24 hours old
 */
const ONE_DAY = 1440; // 24 hours in minutes
export const canResendRequest = (data: DataWithUpdatedAt, time: number = ONE_DAY): boolean => {
  const date = new Date(data.updated_at);
  const now = new Date();
  const timeInMilliseconds = time * 60 * 1000; // Convert minutes to milliseconds

  return (now.getTime() - date.getTime()) > timeInMilliseconds;
};

interface AttendeeData {
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * Check if attendee data is valid or not
 */
export const attendeeIsValid = (attendeeData: AttendeeData): boolean => {
  return !!(attendeeData.first_name.trim()
    && attendeeData.last_name.trim()
    && attendeeData.email.trim());
};

/**
 * Check if the provided url is valid or not
 */
const ALLOWED_PROTOCOL = ["http:", "https:"];
export const isValidUrl = (url: string): boolean => {
  try {
    const validatedUrl = new URL(url);
    return ALLOWED_PROTOCOL.includes(validatedUrl.protocol);
  } catch {
    return false; // Invalid URL
  }
};

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A React component that catches and handles errors within its child components.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * A static method that is invoked after an error has been thrown by a descendant component.
   * It updates the component state to indicate that an error has occurred.
   *
   * @returns {Object} - The updated state object.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * A method that is invoked after an error has been caught by the component.
   * It logs the error and the component stack to a service for error tracking.
   *
   * @param {Error} error - The error object caught by the component.
   * @param {React.ErrorInfo} info - An object containing information about the component stack.
   */
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack ?? '');
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function logErrorToMyService(error: Error, componentStack: string): void {
  console.error(error, componentStack);
}


/**
 * Generates an array of time legends based on the given end time.
 *
 * @param {number} endTime - The end time in hours.
 * @returns {string[]} - An array of time legends in the format "HH:MM".
 */
export const generateTimeLegend = (endTime: number): string[] => {
  const legends: string[] = [];

  for(let i = 0; i < endTime * 60; i += 5){
    const hh = Math.floor(i/60);      // getting hours of day in 24H format
    const mm = i % 60;                  // getting minutes of the hour
    legends.push(("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2));
}
  return legends;
};

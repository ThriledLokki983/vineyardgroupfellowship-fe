/**
 * Helper functions for GroupDetailsPage
 */

/**
 * Format location display based on user role
 * Leaders see full address, members see only postcode
 *
 * @param location - Full location string (e.g., "Veldbies 20, 8935PZ")
 * @param isGroupLeader - Whether the current user is a group leader
 * @param isGroupMember - Whether the current user is a group member
 * @returns Formatted location string
 */
export const getDisplayLocation = (
  location: string,
  isGroupLeader: boolean,
  isGroupMember: boolean
): string => {
  if (!location) return '';

  // Leaders see full address
  if (isGroupLeader) {
    return location;
  }

  // Members who are not leaders only see the postcode
  // Assuming format like "Veldbies 20, 8935PZ" or "123 Main St, 12345"
  // Extract postcode (last part after comma, or last word if no comma)
  const parts = location.split(',').map(part => part.trim());
  if (parts.length > 1) {
    // Return last part (postcode)
    return parts[parts.length - 1];
  }

  // If no comma, try to extract last part after space
  const words = location.trim().split(/\s+/);
  if (words.length > 1) {
    // Return last word (assumed to be postcode)
    return words[words.length - 1];
  }

  // If can't parse, return as is for leaders, hide for members
  return isGroupMember ? location : '';
};

/**
 * Validate image file for upload
 *
 * @param file - File to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select an image file'
    };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }

  return { isValid: true };
};

/**
 * Generate share URL for a group
 *
 * @param groupId - Group ID
 * @returns Full share URL
 */
export const getGroupShareUrl = (groupId: string): string => {
  return `${window.location.origin}/groups/${groupId}`;
};

/**
 * Handle sharing a group (native share or clipboard fallback)
 *
 * @param groupName - Name of the group
 * @param groupId - Group ID
 * @returns Promise that resolves when sharing is complete
 */
export const shareGroup = async (
  groupName: string,
  groupId: string
): Promise<{ method: 'native' | 'clipboard'; success: boolean }> => {
  const shareUrl = getGroupShareUrl(groupId);

  if (navigator.share) {
    try {
      await navigator.share({
        title: groupName,
        text: `Join ${groupName} on Vineyard Group Fellowship`,
        url: shareUrl,
      });
      return { method: 'native', success: true };
    } catch (err) {
      console.log('Error sharing:', err);
      return { method: 'native', success: false };
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      return { method: 'clipboard', success: true };
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      return { method: 'clipboard', success: false };
    }
  }
};

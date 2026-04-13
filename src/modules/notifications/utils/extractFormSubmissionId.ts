
export function extractFormSubmissionId(url: string): string | null {
  if (!url) return null;

  try {
    // Try to match common patterns
    const patterns = [
      /\/form-submissions\/([^/?]+)/,    // /form-submissions/123
      /\/submissions\/([^/?]+)/,         // /submissions/123
      /submissionId=([^&]+)/,            // ?submissionId=123
      /submission_id=([^&]+)/,           // ?submission_id=123
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting form submission ID:', error);
    return null;
  }
}

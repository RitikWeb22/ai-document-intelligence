export const textCleanerService = {
  clean(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove non-printable control characters
      .replace(/[ \t]+/g, ' ') // collapse multiple spaces/tabs
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // collapse multiple blank lines
      .trim();
  },

  hasMeaningfulText(text) {
    if (!text) return false;
    const alphanumericCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
    return alphanumericCount >= 20; // At least 20 alphanumeric characters to be considered meaningful
  }
};

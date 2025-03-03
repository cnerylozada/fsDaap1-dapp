export const formatToValidPath = (text: string) => {
  const lowercase = text.toLowerCase();
  const hyphenated = lowercase.replace(/\s+/g, "-");
  const cleaned = hyphenated.replace(/[^a-z0-9-]/g, "");
  return cleaned;
};

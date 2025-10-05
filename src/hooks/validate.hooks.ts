const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    // Replace starting 0 with 84
    cleaned = "84" + cleaned.slice(1);
  } else if (cleaned.startsWith("84")) {
    // already fine
  } else if (cleaned.startsWith("+84")) {
    cleaned = cleaned.replace(/^\+/, ""); // remove +
  } else {
    // If no 0 or 84, assume missing -> add 84
    cleaned = "84" + cleaned;
  }

  // must be at least 11 chars (84 + 9 digits)
  if (cleaned.length >= 11) {
    return cleaned;
  }
  return null; // invalid
};
export const isValidPhone = (phone: string): boolean => {
  return normalizePhone(phone) !== null;
};

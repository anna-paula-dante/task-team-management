export const isHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);
export const isNotEmpty = (value: string) => value.trim().length > 0;

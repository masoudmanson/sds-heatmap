export const EMPTY_ARRAY: any[] = [];
export const HEATMAP_ITEM_SIZE = 25;
export const Y_ITEM_COUNT = 20;
export const X_ITEM_COUNT = 36;
export const Y_AXIS_WIDTH = 120;
export const X_AXIS_WIDTH = 150;
export const ECHART_AXIS_LABEL_COLOR_HEX = "#555";
export const ECHART_AXIS_LABEL_FONT_SIZE_PX = 14;

export const SELECTED_STYLE = {
  fontWeight: "bold" as never,
  fontFamily: "sans-serif",
  fontSize: 12,
  padding: 4,
};

/**
 * Used to calculate text pixel widths. Should be only created once.
 */
export const CTX =
  (typeof document !== "undefined" &&
    document.createElement("canvas").getContext("2d")) ||
  null;

/**
 * Formats and truncates the cell type name to a given width
 *
 * @param name The text to truncate
 * @param maxWidth The max width in pixels the string should be
 * @param font The font family and font size as a string. Ex. "bold 12px sans-serif"
 * @returns The string fixed to a certain pixel width
 */
export function formatLabel(
  name: string,
  maxWidth: number,
  font: string
): {
  text: string;
  length: number;
} {
  // failsafe, should never be falsy
  if (!CTX) return { text: name, length: 0 };

  CTX.font = font;
  const ellipsisWidth = CTX.measureText("...").width;

  const fullWidth = CTX.measureText(name).width;

  if (fullWidth <= maxWidth) {
    return {
      text: name,
      length: fullWidth,
    };
  }

  const labelHalfWidth = (maxWidth - ellipsisWidth) / 2;

  const firstHalf = getFixedWidth(name, labelHalfWidth, font);
  const secondHalf = getFixedWidth(name, labelHalfWidth, font, true);

  const formattedLabel = firstHalf + " ... " + secondHalf;

  return {
    text: formattedLabel,
    length: CTX.measureText(formattedLabel).width,
  };
}

/**
 * Truncates the string to a given width
 *
 * @param text The text to truncate
 * @param maxWidth The max width in pixels the string should be
 * @param font The font family and font size as a string. Ex. "bold 12px sans-serif"
 * @param reverse Whether to truncate the end or beginning of the string
 * @returns The string fixed to a certain pixel width
 */
export function getFixedWidth(
  text: string,
  maxWidth: number,
  font: string,
  reverse = false
): string {
  // failsafe, should never be falsy
  if (!CTX) return text;

  CTX.font = font;

  if (reverse) {
    for (let i = text.length; i >= 0; i--) {
      const substring = text.substring(i - 1);
      const textWidth = CTX.measureText(substring).width;
      if (textWidth > maxWidth) {
        return text.substring(i);
      }
    }
  } else {
    for (let i = 0; i < text.length; i++) {
      const substring = text.substring(0, i + 1);
      const textWidth = CTX.measureText(substring).width;
      if (textWidth > maxWidth) {
        return text.substring(0, i);
      }
    }
  }

  return text;
}
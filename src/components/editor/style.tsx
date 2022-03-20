export const STYLE_BOLD = "BOLD";
export const STYLE_ITALIC = "ITALIC";
export const STYLE_CODE = "CODE";
export const STYLE_STRIKETHROUGH = "STRIKETHROUGH";

export const styleMap = {
  [STYLE_CODE]: {
    background: "var(--background-transparent-dark)",
    // color: "var(--foreground-inverted)",
    "border-radius": "var(--small-corner-round)",
    padding: "0 4px",
    "font-family": "monospace",
  },
  [STYLE_STRIKETHROUGH]: {
    textDecoration: "line-through",
  },
};

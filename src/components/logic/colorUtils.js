export function hexToRgb(color) {
  try {
    if (!color) return null
    if (color.startsWith('#')) {
      const normalized = color.length === 4 ? color.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3') : color
      const match = normalized.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
      if (!match) return null
      return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
    }
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (rgbMatch) return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] }
  } catch (e) { }
  return null
}

export function rgbToHex({ r, g, b }) {
  const toHex = n => ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function luminance({ r, g, b }) {
  const channels = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function adjustForContrast(color, isDark) {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const l = luminance(rgb)
  if (isDark) {
    if (l > 0.85) {
      const factor = 0.75
      return rgbToHex({ r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor })
    }
  } else if (l < 0.12) {
    const factor = 1.35
    return rgbToHex({ r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor })
  }
  return color
}

export function lightenColor(color, amount = 0.18) {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const alpha = Math.max(0, Math.min(1, amount))
  return rgbToHex({
    r: rgb.r + (255 - rgb.r) * alpha,
    g: rgb.g + (255 - rgb.g) * alpha,
    b: rgb.b + (255 - rgb.b) * alpha,
  })
}

export function hashColorFromKey(key, isDark) {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  const hue = hash % 360
  const saturation = 60
  const lightness = isDark ? 40 : 65
  const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * (saturation / 100)
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = lightness / 100 - chroma / 2
  let r = 0
  let g = 0
  let b = 0
  if (hue < 60) { r = chroma; g = x } else if (hue < 120) { r = x; g = chroma } else if (hue < 180) {
    g = chroma; b = x
  } else if (hue < 240) {
    g = x; b = chroma
  } else if (hue < 300) {
    r = x; b = chroma
  } else {
    r = chroma; b = x
  }
  return rgbToHex({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 })
}

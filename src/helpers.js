export const hexToHsl = (hex) => {
    // Convertir el valor HEX a RGB
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255
    
    // Calcular los valores de máximo y mínimo de RGB
    const cmax = Math.max(r, g, b)
    const cmin = Math.min(r, g, b)
    
    // Calcular el rango de color (delta)
    const delta = cmax - cmin
    
    // Calcular los valores de hue, saturation y lightness (brillo)
    let hue = 0
    let saturation = 0
    let lightness = (cmax + cmin) / 2
    
    if (delta !== 0) {
      switch (cmax) {
        case r:
          hue = ((g - b) / delta) % 6
          break
        case g:
          hue = (b - r) / delta + 2
          break
        case b:
          hue = (r - g) / delta + 4
          break
      }
      saturation = Math.round(( delta / (1 - Math.abs(2 * lightness - 1))) * 100)
    }
    
    // Convertir el valor de hue a grados
    hue = (hue * 60 + 360) % 360

    lightness *= 100
    lightness = Math.round(lightness)
    
    // Retornar el valor de HSL como un objeto
    return {
      h: hue,
      s: saturation,
      l: lightness,
      strinngHSL: `hsl(${hue},${saturation}%,${lightness}%)`
    }
  }
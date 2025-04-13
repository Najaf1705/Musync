const calculateBrightness = (hexColor) => {
    const hex = hexColor.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
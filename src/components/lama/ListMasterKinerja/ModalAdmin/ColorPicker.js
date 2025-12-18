
import { EditableInput, Hue, Saturation } from 'react-color/lib/components/common';

const ColorPicker = ({ color, onChange }) => {
  const handleColorChange = (newColor) => {
    onChange(newColor.hex ? newColor : { hex: newColor });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <EditableInput
          style={{ input: { border: 'none', outline: 'none' } }}
          value={color.hex}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      </div>
      <div style={{ width: '100%', height: '150px', position: 'relative' }}>
        <Saturation
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          hsl={color.hsl}
          hsv={color.hsv}
          onChange={handleColorChange}
        />
      </div>
      <div style={{ width: '100%', height: '10px', position: 'relative', marginTop: '10px' }}>
        <Hue
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          hsl={color.hsl}
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default ColorPicker;

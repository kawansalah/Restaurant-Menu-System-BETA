interface SeparatorProps {
  text: string;
  showLines?: boolean;
  containerClassName?: string;
  textClassName?: string;
  lineClassName?: string;
  lineHeight?: string;
  gap?: string;
  padding?: string;
  alignment?: 'left' | 'center' | 'right';
  theme?: any;
}

function Separator({
  text,
  showLines = true,
  containerClassName = "flex items-center justify-between w-full py-8 px-8",
  textClassName = "text-lg text-center font-bold w-fit whitespace-nowrap ",
  lineClassName,
  lineHeight = "1.5px",
  gap = "gap-4",
  padding = "px-auto",
  alignment = "center",
  theme
}: SeparatorProps) {
  const defaultLineClass = theme 
    ? `w-full ${theme.bgSeparator} rounded-full`
    : `w-full bg-gray-300 rounded-full`;
  
  // Apply height as inline style instead of dynamic class
  const lineStyle = { height: lineHeight };

  const finalLineClass = lineClassName || defaultLineClass;
  
  const alignmentClass = alignment === 'left' 
    ? 'justify-start' 
    : alignment === 'right' 
    ? 'justify-end' 
    : 'justify-center';

  return (
    <div className={containerClassName}>
      <div className={`flex items-center ${alignmentClass} w-full ${gap} ${padding}`}>
        {showLines && alignment !== 'left' && (
          <div className={finalLineClass} style={lineStyle} />
        )}
        <div className={textClassName}>
          {text}
        </div>
        {showLines && alignment !== 'right' && (
          <div className={finalLineClass} style={lineStyle} />
        )}
      </div>
    </div>
  );
}

export default Separator; 
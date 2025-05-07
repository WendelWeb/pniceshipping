import { useState } from 'react';
// import { Brain, DollarSign, Heart, Dumbbell, Palette } from 'lucide-react';

// Define types for the values state
interface PerformanceValues {
  intelligence: number;
  love: number;
  wealth: number;
  discipline: number;
  fitness: number;
  success: number;
}

// Define types for positions and calculations
interface Point {
  x: number;
  y: number;
}

interface AxisLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LabelPosition {
  x: number;
  y: number;
  text: string;
  anchor: string;
}

const PeakPerformanceRadar = () => {
  const [values, setValues] = useState<PerformanceValues>({
    intelligence: 120,
    love: 0,
    wealth: 120,
    discipline: 120,
    fitness: 120,
    success: 120,
  });
  console.log(setValues);
  
  
  // const handleIncrement = (key: keyof PerformanceValues): void => {
  //   if (values[key] < 100) {
  //     setValues({ ...values, [key]: values[key] + 5 });
  //   }
  // };

  // const handleDecrement = (key: keyof PerformanceValues): void => {
  //   if (values[key] > 0) {
  //     setValues({ ...values, [key]: values[key] - 5 });
  //   }
  // };

  // Calculate polygon points for the radar chart
  const calculatePoints = (): string => {
    const center: Point = { x: 150, y: 150 };
    const radius = 90; // Further reduced radius for the actual radar
    const numPoints = Object.keys(values).length;
    const angleStep = (2 * Math.PI) / numPoints;

    const getCoordinates = (value: number, index: number): Point => {
      const angle = index * angleStep - Math.PI / 2;
      const distance = (value / 100) * radius;
      return {
        x: center.x + distance * Math.cos(angle),
        y: center.y + distance * Math.sin(angle),
      };
    };

    const keys = Object.keys(values) as Array<keyof PerformanceValues>;
    const points = keys.map((key, i) => getCoordinates(values[key], i));
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  };

  // Calculate grid lines
  // const calculateGridLines = (): string[] => {
  //   const center: Point = { x: 150, y: 150 };
  //   const radius = 120;
  //   const numPoints = Object.keys(values).length;
  //   const angleStep = (2 * Math.PI) / numPoints;
  //   const levels = [0.2, 0.4, 0.6, 0.8, 1];

  //   return levels.map((level) => {
  //     const points: Point[] = [];
  //     for (let i = 0; i < numPoints; i++) {
  //       const angle = i * angleStep - Math.PI / 2;
  //       const distance = level * radius;
  //       points.push({
  //         x: center.x + distance * Math.cos(angle),
  //         y: center.y + distance * Math.sin(angle),
  //       });
  //     }
  //     return points.map((p) => `${p.x},${p.y}`).join(' ');
  //   });
  // };

  // Calculate axis lines
  const calculateAxisLines = (): AxisLine[] => {
    const center: Point = { x: 150, y: 150 };
    const radius = 90; // Reduced to match new radar points
    const numPoints = Object.keys(values).length;
    const angleStep = (2 * Math.PI) / numPoints;

    return Array(numPoints)
      .fill(null)
      .map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return {
          x1: center.x,
          y1: center.y,
          x2: center.x + radius * Math.cos(angle),
          y2: center.y + radius * Math.sin(angle),
        };
      });
  };

  // Calculate icon positions
  // const calculateIconPositions = (): Point[] => {
  //   const center: Point = { x: 150, y: 150 };
  //   const radius = 100; // Further reduced for icon positions
  //   const numPoints = Object.keys(values).length;
  //   const angleStep = (2 * Math.PI) / numPoints;

  //   return Array(numPoints)
  //     .fill(null)
  //     .map((_, i) => {
  //       const angle = i * angleStep - Math.PI / 2;
  //       return {
  //         x: center.x + radius * Math.cos(angle),
  //         y: center.y + radius * Math.sin(angle),
  //       };
  //     });
  // };

  // Calculate label positions with fixed positioning for top and bottom labels
  const calculateLabelPositions = (): LabelPosition[] => {
    const center: Point = { x: 150, y: 150 };
    const radius = 115; // Further reduced radius for labels
    const numPoints = Object.keys(values).length;
    const angleStep = (2 * Math.PI) / numPoints;
    const keys = Object.keys(values).map((key) => key.toUpperCase());

    return keys.map((key, i) => {
      const angle = i * angleStep - Math.PI / 2;
      let anchor = 'middle';
      let offsetX = 0;
      let offsetY = 0;
      
      // Special handling for top label (intelligence)
      if (Math.abs(angle + Math.PI / 2) < 0.1) { // Top position (intelligence)
        offsetY = -10; // Further reduced offset
      } 
      // Special handling for bottom label (discipline)
      else if (Math.abs(angle - Math.PI / 2) < 0.1) { // Bottom position (discipline)
        offsetY = 12; // Further reduced offset
      }
      // Handle other positions
      else if (angle > -Math.PI / 2 && angle < Math.PI / 2) {
        anchor = 'start';
        offsetX = 5;
      } else if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        anchor = 'end';
        offsetX = -5;
      }
      
      return {
        x: center.x + radius * Math.cos(angle) + offsetX,
        y: center.y + radius * Math.sin(angle) + offsetY,
        text: key,
        anchor: anchor,
      };
    });
  };

  // Define icons corresponding to the five data points
  // const icons = [
  //   <Brain key="brain" size={20} color="#64B5F6" />, // Intelligence
  //   <DollarSign key="dollar" size={20} color="#FFD54F" />, // Wealth
  //   <Heart key="heart" size={20} color="#FF8A65" />, // Relationships
  //   <Dumbbell key="dumbbell" size={20} color="#81C784" />, // Fitness
  //   <Palette key="palette" size={20} color="#BA68C8" />, // Creativity
  // ];

  const axisLines = calculateAxisLines();
  // const iconPositions = calculateIconPositions();
  const labelPositions = calculateLabelPositions();

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg text-white">
      <h1 className="text-2xl font-bold text-center">PEAK MALE PERFORMANCE</h1>

      <div className="relative w-full h-96 mb-8">
        <svg width="100%" height="100%" viewBox="0 0 300 300">
          {/* Grid background - further reduced */}
          <circle cx="150" cy="150" r="110" fill="none" stroke="#333" strokeWidth="0.5" />

          {/* Grid circles - further reduced */}
          {[18, 36, 54, 72, 90].map((r, i) => (
            <circle
              key={i}
              cx="150"
              cy="150"
              r={r}
              fill="none"
              stroke="#333"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#555"
              strokeWidth="0.5"
            />
          ))}

          {/* Radar background with gradient */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(65, 184, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(65, 184, 255, 0.2)" />
            </radialGradient>
          </defs>

          {/* Performance polygon */}
          <polygon
            points={calculatePoints()}
            fill="url(#radarGradient)"
            stroke="#41b8ff"
            strokeWidth="2"
          />

          {/* Value circles on the polygon */}
          {calculatePoints()
            .split(' ')
            .map((point, i) => {
              const [x, y] = point.split(',').map(Number);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="white"
                  stroke="#41b8ff"
                  strokeWidth="2"
                />
              );
            })}

          {/* Labels with better positioning */}
          {labelPositions.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={label.y}
              fill="white"
              fontSize="10"
              textAnchor={label.anchor}
              fontWeight="bold"
            >
              {label.text}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default PeakPerformanceRadar;
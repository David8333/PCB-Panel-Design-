
import React, { useMemo } from 'react';
import { PCBConfig } from '../types';

interface PCBPanelDrawingProps {
  config: PCBConfig;
}

const DimensionLine = ({ 
  x1, y1, x2, y2, 
  value, 
  position = 'top', 
  offset = 10, 
  textGap = 0 
}: { 
  x1: number, y1: number, x2: number, y2: number, 
  value: number | string, 
  position?: 'top' | 'bottom' | 'left' | 'right', 
  offset?: number,
  textGap?: number
}) => {
  const tickSize = 3;
  const isHorizontal = Math.abs(y1 - y2) < 0.1;
  const textColor = "#1e3a8a"; // 深藍色
  const lineColor = "#cbd5e1"; // 標註線顏色
  
  // 文字距離標註線的基礎位移量
  // 當 textGap 為 0 時，文字稍微浮在線上 (約 4px) 避免壓線，這是製圖習慣
  const baseSpacing = textGap === 0 ? 4 : textGap;

  let lx1 = x1, ly1 = y1, lx2 = x2, ly2 = y2;
  let tx = 0, ty = 0, rotate = 0;

  if (isHorizontal) {
    ly1 = ly2 = (position === 'top' ? y1 - offset : y1 + offset);
    tx = (x1 + x2) / 2;
    ty = position === 'top' ? ly1 - baseSpacing : ly1 + baseSpacing;
  } else {
    lx1 = lx2 = (position === 'left' ? x1 - offset : x1 + offset);
    tx = position === 'left' ? lx1 - baseSpacing : lx1 + baseSpacing;
    ty = (y1 + y2) / 2;
    rotate = -90; // 從下往上閱讀方向
  }

  return (
    <g className="dimension-group">
      {/* 延伸線 (Extension lines) */}
      <line x1={x1} y1={y1} x2={isHorizontal ? x1 : lx1} y2={isHorizontal ? ly1 : y1} stroke="#f1f5f9" strokeWidth="0.5" />
      <line x1={x2} y1={y2} x2={isHorizontal ? x2 : lx2} y2={isHorizontal ? ly2 : y2} stroke="#f1f5f9" strokeWidth="0.5" />
      
      {/* 標註主線 */}
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={lineColor} strokeWidth="0.8" />
      
      {/* 刻度線 */}
      {isHorizontal ? (
        <>
          <line x1={lx1} y1={ly1 - tickSize} x2={lx1} y2={ly1 + tickSize} stroke={lineColor} strokeWidth="0.8" />
          <line x1={lx2} y1={ly2 - tickSize} x2={lx2} y2={ly2 + tickSize} stroke={lineColor} strokeWidth="0.8" />
        </>
      ) : (
        <>
          <line x1={lx1 - tickSize} y1={ly1} x2={lx1 + tickSize} y2={ly1} stroke={lineColor} strokeWidth="0.8" />
          <line x1={lx2 - tickSize} y1={ly2} x2={lx2 + tickSize} y2={ly2} stroke={lineColor} strokeWidth="0.8" />
        </>
      )}

      {/* 標註數字 */}
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={rotate ? `rotate(${rotate}, ${tx}, ${ty})` : ''}
        className="text-[10px] font-black select-none pointer-events-none"
        fill={textColor}
      >
        {value}
      </text>
    </g>
  );
};

export const PCBPanelDrawing: React.FC<PCBPanelDrawingProps> = ({ config }) => {
  const {
    unitWidth, unitHeight, countX, countY,
    railTop, railBottom, railLeft, railRight,
    gapX, gapY
  } = config;

  const totalWidth = railLeft + railRight + (unitWidth * countX) + (gapX * Math.max(0, countX - 1));
  const totalHeight = railTop + railBottom + (unitHeight * countY) + (gapY * Math.max(0, countY - 1));

  // 格式化數字：整數顯示整數，小數最多顯示兩位
  const formatValue = (num: number) => {
    return Number(num.toFixed(2)).toString();
  };

  // 適配檢視範圍，確保上下左右標註文字在手機與電腦上皆完整顯示不裁切
  const margin = Math.max(65, (totalWidth + totalHeight) * 0.1);
  const viewBoxWidth = totalWidth + margin * 2;
  const viewBoxHeight = totalHeight + margin * 2;

  const units = useMemo(() => {
    const list = [];
    if (unitWidth > 0 && unitHeight > 0 && countX > 0 && countY > 0) {
      for (let y = 0; y < countY; y++) {
        for (let x = 0; x < countX; x++) {
          list.push({
            x: railLeft + x * (unitWidth + gapX),
            y: railTop + y * (unitHeight + gapY),
          });
        }
      }
    }
    return list;
  }, [config]);

  if (totalWidth <= 0 || totalHeight <= 0) {
    return (
      <div className="w-full h-full min-h-[280px] sm:min-h-[360px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold p-6 sm:p-8 text-center text-sm sm:text-base">
        請於左側或上方輸入尺寸參數以生成即時併板預覽圖
      </div>
    );
  }

  const WIREFRAME_COLOR = "#064e3b";

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
      <svg
        viewBox={`-${margin} -${margin} ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[65vh] md:max-h-full select-none"
      >
        <rect x={-margin} y={-margin} width={viewBoxWidth} height={viewBoxHeight} fill="#ffffff" />

        {/* 併板主外框 (0.1mm) */}
        <rect x={0} y={0} width={totalWidth} height={totalHeight} fill="none" stroke={WIREFRAME_COLOR} strokeWidth="0.1" />

        {/* 板邊線框 (0.1mm) */}
        <g stroke={WIREFRAME_COLOR} strokeWidth="0.1" fill="none">
          {railTop > 0 && <rect x={0} y={0} width={totalWidth} height={railTop} />}
          {railBottom > 0 && <rect x={0} y={totalHeight - railBottom} width={totalWidth} height={railBottom} />}
          {railLeft > 0 && <rect x={0} y={railTop} width={railLeft} height={totalHeight - railTop - railBottom} />}
          {railRight > 0 && <rect x={totalWidth - railRight} y={railTop} width={railRight} height={totalHeight - railTop - railBottom} />}
        </g>

        {/* PCB 單板線框 (0.3mm) */}
        {units.map((pos, i) => (
          <rect
            key={i}
            x={pos.x}
            y={pos.y}
            width={unitWidth}
            height={unitHeight}
            fill="none"
            stroke={WIREFRAME_COLOR}
            strokeWidth="0.3"
          />
        ))}

        {/* --- 標註系統 --- */}
        
        {/* 總尺寸標註 (文字距離 0mm, 自動精度) */}
        <DimensionLine x1={0} y1={0} x2={totalWidth} y2={0} value={formatValue(totalWidth)} position="top" offset={35} textGap={0} />
        <DimensionLine x1={0} y1={0} x2={0} y2={totalHeight} value={formatValue(totalHeight)} position="left" offset={35} textGap={0} />

        {/* 單板尺寸 (文字距離 5mm) */}
        {units.length > 0 && (
          <>
            <DimensionLine x1={units[0].x} y1={units[0].y + unitHeight} x2={units[0].x + unitWidth} y2={units[0].y + unitHeight} value={unitWidth} position="bottom" offset={10} textGap={5} />
            <DimensionLine x1={units[0].x + unitWidth} y1={units[0].y} x2={units[0].x + unitWidth} y2={units[0].y + unitHeight} value={unitHeight} position="right" offset={10} textGap={5} />
          </>
        )}

        {/* 中間間距 (文字距離 0mm) */}
        {countX > 1 && gapX > 0 && (
           <DimensionLine x1={railLeft + unitWidth} y1={railTop} x2={railLeft + unitWidth + gapX} y2={railTop} value={gapX} position="top" offset={10} textGap={0} />
        )}
        {countY > 1 && gapY > 0 && (
           <DimensionLine x1={railLeft} y1={railTop + unitHeight} x2={railLeft} y2={railTop + unitHeight + gapY} value={gapY} position="left" offset={10} textGap={0} />
        )}

        {/* 板邊 (文字距離 0mm) */}
        {railTop > 0 && (
          <DimensionLine x1={totalWidth} y1={0} x2={totalWidth} y2={railTop} value={railTop} position="right" offset={10} textGap={0} />
        )}
        {railBottom > 0 && (
          <DimensionLine x1={totalWidth} y1={totalHeight - railBottom} x2={totalWidth} y2={totalHeight} value={railBottom} position="right" offset={10} textGap={0} />
        )}
        {railLeft > 0 && (
          <DimensionLine x1={0} y1={totalHeight} x2={railLeft} y2={totalHeight} value={railLeft} position="bottom" offset={10} textGap={0} />
        )}
        {railRight > 0 && (
          <DimensionLine x1={totalWidth - railRight} y1={totalHeight} x2={totalWidth} y2={totalHeight} value={railRight} position="bottom" offset={10} textGap={0} />
        )}
      </svg>
    </div>
  );
};

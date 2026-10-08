
import React, { useState, useMemo } from 'react';
import { PCBConfig, PanelResult } from './types';
import { NumberInput } from './components/NumberInput';
import { PCBPanelDrawing } from './components/PCBPanelDrawing';
import { Layout, Settings, Ruler, Box, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const INITIAL_CONFIG: PCBConfig = {
  unitWidth: 0,
  unitHeight: 0,
  countX: 0,
  countY: 0,
  railTop: 0,
  railBottom: 0,
  railLeft: 0,
  railRight: 0,
  gapX: 0,
  gapY: 0,
};

const MIN_ZOOM = 25;
const MAX_ZOOM = 300;
const ZOOM_STEP = 25;

const App: React.FC = () => {
  // 所有欄位預設為 0
  const [config, setConfig] = useState<PCBConfig>(INITIAL_CONFIG);
  const [zoom, setZoom] = useState<number>(100);

  const results = useMemo((): PanelResult => {
    const totalW = config.railLeft + config.railRight + (config.unitWidth * config.countX) + (config.gapX * (Math.max(0, config.countX - 1)));
    const totalH = config.railTop + config.railBottom + (config.unitHeight * config.countY) + (config.gapY * (Math.max(0, config.countY - 1)));
    const uArea = config.unitWidth * config.unitHeight;
    const tUnits = config.countX * config.countY;
    const tArea = totalW * totalH;

    return {
      totalWidth: totalW,
      totalHeight: totalH,
      unitArea: uArea,
      totalArea: tArea,
      totalUnits: tUnits
    };
  }, [config]);

  const handleUpdate = (key: keyof PCBConfig, val: number) => {
    setConfig(prev => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setZoom(100);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  };

  const hasNonZeroValue = useMemo(() => {
    return Object.values(config).some(val => val !== 0);
  }, [config]);

  // 格式化數字：整數顯示整數，小數最多顯示兩位
  const formatDim = (num: number) => {
    return Number(num.toFixed(2)).toString();
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] text-slate-900">
      {/* 側邊控制欄 (手機版自然向下捲動不遮擋畫面，電腦版固定於左側) */}
      <aside className="w-full md:w-[340px] lg:w-[380px] md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 sm:p-6 flex flex-col gap-6 md:h-screen md:sticky md:top-0 md:overflow-y-auto z-10 shadow-sm md:shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-slate-900 rounded-xl shrink-0">
            <Box className="text-white w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight truncate">PCB 尺寸設計器</h1>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide truncate">Dimension Designer</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <div className="flex items-center gap-2 text-slate-500 font-bold mb-3 text-xs">
              <Settings className="w-3.5 h-3.5" />
              <span>01. 單板基本資訊</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <NumberInput label="單板寬度" value={config.unitWidth} onChange={(v) => handleUpdate('unitWidth', v)} />
              <NumberInput label="單板長度" value={config.unitHeight} onChange={(v) => handleUpdate('unitHeight', v)} />
              <NumberInput label="X 軸併數" value={config.countX} onChange={(v) => handleUpdate('countX', v)} suffix="Pcs" />
              <NumberInput label="Y 軸併數" value={config.countY} onChange={(v) => handleUpdate('countY', v)} suffix="Pcs" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 text-slate-500 font-bold mb-3 text-xs">
              <Ruler className="w-3.5 h-3.5" />
              <span>02. 工藝板邊尺寸</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <NumberInput label="上板邊" value={config.railTop} onChange={(v) => handleUpdate('railTop', v)} />
              <NumberInput label="下板邊" value={config.railBottom} onChange={(v) => handleUpdate('railBottom', v)} />
              <NumberInput label="左板邊" value={config.railLeft} onChange={(v) => handleUpdate('railLeft', v)} />
              <NumberInput label="右板邊" value={config.railRight} onChange={(v) => handleUpdate('railRight', v)} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 text-slate-500 font-bold mb-3 text-xs">
              <Layout className="w-3.5 h-3.5" />
              <span>03. 中間併板間距</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <NumberInput label="X 軸間距" value={config.gapX} onChange={(v) => handleUpdate('gapX', v)} />
              <NumberInput label="Y 軸間距" value={config.gapY} onChange={(v) => handleUpdate('gapY', v)} />
            </div>
          </section>

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasNonZeroValue}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              hasNonZeroValue
                ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置所有數值</span>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          所有尺寸單位均為 mm
        </div>
      </aside>

      {/* 主繪圖與資訊區域 */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 flex flex-col gap-6 lg:gap-8 md:h-screen md:overflow-y-auto">
        {/* 核心資訊看板 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 shrink-0">
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-500 mb-1.5">併板最終尺寸 (W×H)</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tabular-nums break-words">
              {formatDim(results.totalWidth)} <span className="text-slate-300">×</span> {formatDim(results.totalHeight)}
              <span className="text-xs font-medium text-slate-400 ml-1">mm</span>
            </h2>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-500 mb-1.5">單板原始尺寸</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tabular-nums break-words">
              {formatDim(config.unitWidth)} <span className="text-slate-300">×</span> {formatDim(config.unitHeight)}
              <span className="text-xs font-medium text-slate-400 ml-1">mm</span>
            </h2>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-500 mb-1.5">中間間距 (X / Y)</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-700 tabular-nums break-words">
              {formatDim(config.gapX)} <span className="text-slate-300">/</span> {formatDim(config.gapY)}
              <span className="text-xs font-medium text-slate-400 ml-1">mm</span>
            </h2>
          </div>
        </div>

        {/* 繪圖顯示區 */}
        <div className="flex-1 flex flex-col min-h-[380px] sm:min-h-[460px] bg-white rounded-2xl sm:rounded-[32px] border border-slate-200/80 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Box className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">併板尺寸圖形</h3>
                <p className="text-xs text-slate-400 font-medium">
                  CAD Scale Preview · 總數量 {results.totalUnits} Pcs
                </p>
              </div>
            </div>

            {/* 圖面文字百分比縮放控制器 */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-1 pl-2.5">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">文字縮放</span>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}
                title="縮小圖面文字"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={5}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="圖面文字縮放百分比"
                className="w-20 sm:w-28 accent-slate-900 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom(100)}
                title="點擊還原 100% 文字大小"
                className="min-h-[36px] px-2.5 rounded-lg text-xs font-black text-slate-800 hover:bg-white hover:shadow-sm transition-all tabular-nums whitespace-nowrap cursor-pointer"
              >
                {zoom}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}
                title="放大圖面文字"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-[300px] sm:min-h-[360px] overflow-hidden">
            <PCBPanelDrawing config={config} zoom={zoom} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

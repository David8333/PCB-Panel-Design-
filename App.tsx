
import React, { useState, useMemo } from 'react';
import { PCBConfig, PanelResult } from './types';
import { NumberInput } from './components/NumberInput';
import { PCBPanelDrawing } from './components/PCBPanelDrawing';
import { Layout, Settings, Ruler, Box } from 'lucide-react';

const App: React.FC = () => {
  // 所有欄位預設為 0
  const [config, setConfig] = useState<PCBConfig>({
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
  });

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

  // 格式化數字：整數顯示整數，小數最多顯示兩位
  const formatDim = (num: number) => {
    return Number(num.toFixed(2)).toString();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* 側邊控制欄 */}
      <aside className="w-full md:w-[350px] lg:w-[380px] bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto max-h-screen sticky top-0 z-10 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="p-2.5 bg-slate-900 rounded-xl">
            <Box className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">PCB 尺寸設計器</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dimension Designer</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 mt-2">
          <section>
            <div className="flex items-center gap-2 text-slate-400 font-black mb-4 text-[11px] uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5" />
              <span>1. 單板基本資訊</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberInput label="單板寬度" value={config.unitWidth} onChange={(v) => handleUpdate('unitWidth', v)} />
              <NumberInput label="單板長度" value={config.unitHeight} onChange={(v) => handleUpdate('unitHeight', v)} />
              <NumberInput label="X 軸併數" value={config.countX} onChange={(v) => handleUpdate('countX', v)} suffix="Pcs" />
              <NumberInput label="Y 軸併數" value={config.countY} onChange={(v) => handleUpdate('countY', v)} suffix="Pcs" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 text-slate-400 font-black mb-4 text-[11px] uppercase tracking-wider">
              <Ruler className="w-3.5 h-3.5" />
              <span>2. 工藝板邊尺寸</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberInput label="上板邊" value={config.railTop} onChange={(v) => handleUpdate('railTop', v)} />
              <NumberInput label="下板邊" value={config.railBottom} onChange={(v) => handleUpdate('railBottom', v)} />
              <NumberInput label="左板邊" value={config.railLeft} onChange={(v) => handleUpdate('railLeft', v)} />
              <NumberInput label="右板邊" value={config.railRight} onChange={(v) => handleUpdate('railRight', v)} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 text-slate-400 font-black mb-4 text-[11px] uppercase tracking-wider">
              <Layout className="w-3.5 h-3.5" />
              <span>3. 中間併板間距</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberInput label="X 軸間距" value={config.gapX} onChange={(v) => handleUpdate('gapX', v)} />
              <NumberInput label="Y 軸間距" value={config.gapY} onChange={(v) => handleUpdate('gapY', v)} />
            </div>
          </section>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
          所有尺寸單位均為 mm
        </div>
      </aside>

      {/* 主繪圖區域 */}
      <main className="flex-1 p-6 md:p-12 flex flex-col gap-10 overflow-hidden">
        {/* 核心資訊看板 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">併板最終尺寸 (W×H)</p>
             <h2 className="text-3xl font-black text-slate-900">{formatDim(results.totalWidth)} <span className="text-slate-300">×</span> {formatDim(results.totalHeight)} <span className="text-xs font-medium text-slate-400 ml-1">mm</span></h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">單板原始尺寸</p>
             <h2 className="text-3xl font-black text-slate-900">{config.unitWidth} <span className="text-slate-300">×</span> {config.unitHeight} <span className="text-xs font-medium text-slate-400 ml-1">mm</span></h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">中間間距 (X/Y)</p>
             <h2 className="text-3xl font-black text-green-700">{config.gapX} <span className="text-slate-300">/</span> {config.gapY} <span className="text-xs font-medium text-slate-400 ml-1">mm</span></h2>
          </div>
        </div>

        {/* 繪圖顯示區 */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 border border-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Box className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">併板尺寸圖形</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">CAD SCALE PREVIEW</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">數量: {results.totalUnits}</span>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <PCBPanelDrawing config={config} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

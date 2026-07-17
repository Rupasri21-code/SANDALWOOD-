'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  Trees, Sprout, Layers, Landmark, TrendingUp, Award,
  ChevronDown, Building2, User, X, Info
} from 'lucide-react';

const formatCurrency = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Animated Number Component
const AnimatedNumber = ({ value, prefix = '', suffix = '', duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const incrementTime = (duration / end) * 1000;
    const timer = setInterval(() => {
      start += Math.max(Math.floor(end / 20), 1);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime > 10 ? incrementTime : 10);

    return () => clearInterval(timer);
  }, [value, duration]);

  const formatted = typeof value === 'number' && prefix === '₹' 
    ? formatCurrency(displayValue).replace('₹', '')
    : displayValue.toLocaleString('en-IN');

  return <span>{prefix}{formatted}{suffix}</span>;
};

// Yield schedule array based on business model (Index = Year)
// Year 0 = 0kg, Year 1 = 1kg, Year 2 = 3kg...
const YIELD_SCHEDULE = [0, 1, 3, 6, 10, 15, 20, 28, 40, 55, 70, 85, 100];

export default function InvestmentCalculator() {
  // 1. Input State Management
  const [plotSize, setPlotSize] = useState('12.5 Cents');
  const [treeCount, setTreeCount] = useState(50);
  const [plantationAge, setPlantationAge] = useState(12);
  const [survivalRate, setSurvivalRate] = useState(100);
  const [yieldPerTree, setYieldPerTree] = useState(28);
  const [marketPricePerTon, setMarketPricePerTon] = useState(15000000);
  const [initialInvestment, setInitialInvestment] = useState(1500000);
  const [annualMaintenance, setAnnualMaintenance] = useState(12000);
  const [profitSharingRatio, setProfitSharingRatio] = useState('50:50');

  // Handle Plot Size Change
  const handlePlotSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPlotSize(val);
    
    // Auto-update trees, investment, and maintenance based on mapping
    switch (val) {
      case '12.5 Cents': 
        setTreeCount(50); 
        setInitialInvestment(1500000);
        setAnnualMaintenance(12000);
        break;
      case '25 Cents': 
        setTreeCount(100); 
        setInitialInvestment(3000000);
        setAnnualMaintenance(24000);
        break;
      case '50 Cents': 
        setTreeCount(200); 
        setInitialInvestment(6000000);
        setAnnualMaintenance(48000);
        break;
      case '75 Cents': 
        setTreeCount(300); 
        setInitialInvestment(9000000);
        setAnnualMaintenance(72000);
        break;
      case '1 Acre': 
        setTreeCount(400); 
        setInitialInvestment(12000000);
        setAnnualMaintenance(96000);
        break;
      default: 
        break; // Custom - handled in the input
    }
  };

  // 2. Calculations (useMemo)
  const metrics = useMemo(() => {
    // Step 1: Surviving Trees
    const survivingTrees = Math.round(treeCount * (survivalRate / 100));
    
    // Step 3: Total Yield
    const totalYieldKg = survivingTrees * yieldPerTree;
    const totalYieldTon = totalYieldKg / 1000;
    
    // Step 4: Gross Revenue
    const grossRevenue = totalYieldTon * marketPricePerTon;
    
    // Step 5: Total Investment
    const maintenanceCost = annualMaintenance * plantationAge;
    const totalInvestment = initialInvestment + maintenanceCost;
    
    // Step 6: Net Profit
    const netProfit = grossRevenue - totalInvestment;
    
    // Step 7: ROI
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    // Step 8: Profit Sharing
    let investorSplit = 0.5;
    let managementSplit = 0.5;
    if (profitSharingRatio === '100%') { investorSplit = 1; managementSplit = 0; }
    if (profitSharingRatio === '80:20') { investorSplit = 0.8; managementSplit = 0.2; }
    if (profitSharingRatio === '70:30') { investorSplit = 0.7; managementSplit = 0.3; }
    if (profitSharingRatio === '60:40') { investorSplit = 0.6; managementSplit = 0.4; }
    if (profitSharingRatio === '50:50') { investorSplit = 0.5; managementSplit = 0.5; }
    if (profitSharingRatio === '40:60') { investorSplit = 0.4; managementSplit = 0.6; }

    const investorShare = netProfit > 0 ? netProfit * investorSplit : 0;
    const managementShare = netProfit > 0 ? netProfit * managementSplit : 0;

    return {
      survivingTrees,
      totalYieldKg,
      totalYieldTon,
      grossRevenue,
      maintenanceCost,
      totalInvestment,
      netProfit,
      roi,
      investorShare,
      managementShare
    };
  }, [treeCount, survivalRate, yieldPerTree, marketPricePerTon, annualMaintenance, plantationAge, initialInvestment, profitSharingRatio]);

  // Yearly Growth Data (for Table & Charts)
  const yearlyData = useMemo(() => {
    const data = [];
    
    // Step 9 & 10: Yearly projections
    for (let year = 1; year <= 12; year++) {
      const scheduleValue = YIELD_SCHEDULE[year] || 0;
      const targetScheduleValue = YIELD_SCHEDULE[plantationAge] || 1;
      const currentYield = targetScheduleValue > 0 ? (scheduleValue / targetScheduleValue) * yieldPerTree : 0;
      
      const totalYieldKg = metrics.survivingTrees * currentYield;
      const totalYieldTon = totalYieldKg / 1000;
      const marketValue = totalYieldTon * marketPricePerTon;
      const runningInvestment = initialInvestment + (annualMaintenance * year);
      const runningNetProfit = marketValue - runningInvestment;
      const runningROI = runningInvestment > 0 ? (runningNetProfit / runningInvestment) * 100 : 0;

      data.push({
        year,
        yieldPerTree: currentYield,
        totalYieldKg: totalYieldKg.toFixed(1),
        marketValue,
        cumulativeMaintenance: annualMaintenance * year,
        runningInvestment,
        runningNetProfit,
        roi: runningROI.toFixed(1)
      });
    }
    return data;
  }, [metrics.survivingTrees, yieldPerTree, plantationAge, marketPricePerTon, initialInvestment, annualMaintenance]);

  // Filter yearly data up to plantation age
  const displayYearlyData = yearlyData.filter(d => d.year <= plantationAge);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="text-[#D9B36D] text-2xl md:text-3xl font-serif font-bold tracking-wide mb-2">Dynamic Investment Calculator</h2>
        <p className="text-[#B8C7BC] text-sm max-w-2xl mx-auto">
          Adjust the parameters below to project your potential long-term wealth through sandalwood cultivation.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 flex flex-col gap-6 bg-[rgba(6,31,24,0.95)] border border-[#C49A5A]/30 rounded-[24px] p-6 shadow-xl">
          <h3 className="text-[#F7F0E4] text-[16px] font-bold tracking-wide uppercase border-b border-[#C49A5A]/20 pb-3 mb-2 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C49A5A]" />
            Parameters
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Plot Size</label>
              <div className="relative">
                {plotSize === 'Custom' ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        onChange={(e) => {
                          const acres = parseFloat(e.target.value) || 0;
                          setTreeCount(Math.round(acres * 400));
                          setInitialInvestment(acres * 12000000);
                          setAnnualMaintenance(acres * 96000);
                        }}
                        className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 pr-14 text-sm focus:outline-none focus:border-[#D9B36D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-[12px] text-sm text-[#B8C7BC]">Acres</span>
                    </div>
                    <button 
                      onClick={() => setPlotSize('12.5 Cents')}
                      className="w-11 h-[44px] rounded-xl border border-[#C49A5A]/35 bg-[#0B241C] hover:bg-[#C49A5A]/20 text-[#C49A5A] flex items-center justify-center transition-colors shrink-0"
                      title="Back to predefined sizes"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <select
                      value={plotSize}
                      onChange={handlePlotSizeChange}
                      className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D] appearance-none"
                    >
                      <option value="12.5 Cents">12.5 Cents</option>
                      <option value="25 Cents">25 Cents</option>
                      <option value="50 Cents">50 Cents</option>
                      <option value="75 Cents">75 Cents</option>
                      <option value="1 Acre">1 Acre</option>
                      <option value="Custom">Custom</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#C49A5A] pointer-events-none" />
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Total Trees</label>
              <input
                type="number"
                min="1"
                value={treeCount}
                onChange={(e) => setTreeCount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Plantation Age (Years)</label>
              <span className="text-[#D9B36D] font-bold text-sm">{plantationAge} Yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={plantationAge}
              onChange={(e) => setPlantationAge(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Survival Rate (%)</label>
              <span className="text-[#D9B36D] font-bold text-sm">{survivalRate}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              value={survivalRate}
              onChange={(e) => setSurvivalRate(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Yield Per Tree (Kg)</label>
              <span className="text-[#D9B36D] font-bold text-sm">{yieldPerTree} kg</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={yieldPerTree}
              onChange={(e) => setYieldPerTree(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Estimated Market Price (₹/Ton)</label>
            <input
              type="text"
              value={marketPricePerTon.toLocaleString('en-IN')}
              onChange={(e) => setMarketPricePerTon(Math.max(0, parseInt(e.target.value.replace(/,/g, '')) || 0))}
              className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#B8C7BC] uppercase font-semibold">Initial Invest (₹)</label>
              <input
                type="text"
                value={initialInvestment.toLocaleString('en-IN')}
                onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value.replace(/,/g, '')) || 0))}
                className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#B8C7BC] uppercase font-semibold">Annual Maintenance Cost</label>
              <input
                type="text"
                value={annualMaintenance.toLocaleString('en-IN')}
                onChange={(e) => setAnnualMaintenance(Math.max(0, parseInt(e.target.value.replace(/,/g, '')) || 0))}
                className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#B8C7BC] uppercase font-semibold">Profit Sharing (Investor:Admin)</label>
            <div className="relative">
              <select
                value={profitSharingRatio}
                onChange={(e) => setProfitSharingRatio(e.target.value)}
                className="w-full h-[44px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-xl px-3 text-sm focus:outline-none focus:border-[#D9B36D] appearance-none"
              >
                <option value="100%">100% Investor</option>
                <option value="80:20">80:20</option>
                <option value="70:30">70:30</option>
                <option value="60:40">60:40</option>
                <option value="50:50">50:50</option>
                <option value="40:60">40:60</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#C49A5A] pointer-events-none" />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: OUTPUTS & CHARTS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 flex flex-col items-center text-center">
              <Trees className="w-6 h-6 text-[#D9B36D] mb-2" />
              <span className="text-[10px] text-[#B8C7BC] uppercase mb-1">Total Trees</span>
              <span className="text-xl font-bold text-[#F7F0E4]"><AnimatedNumber value={treeCount} /></span>
            </motion.div>
            
            <motion.div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 flex flex-col items-center text-center">
              <Sprout className="w-6 h-6 text-[#D9B36D] mb-2" />
              <span className="text-[10px] text-[#B8C7BC] uppercase mb-1">Surviving Trees</span>
              <span className="text-xl font-bold text-[#F7F0E4]"><AnimatedNumber value={metrics.survivingTrees} /></span>
            </motion.div>

            <motion.div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 flex flex-col items-center text-center">
              <Layers className="w-6 h-6 text-[#D9B36D] mb-2" />
              <span className="text-[10px] text-[#B8C7BC] uppercase mb-1">Total Yield (Tons)</span>
              <span className="text-xl font-bold text-[#F7F0E4]">{metrics.totalYieldTon.toFixed(2)}</span>
            </motion.div>

            <motion.div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 flex flex-col items-center text-center relative">
              <TrendingUp className="w-6 h-6 text-[#D9B36D] mb-2" />
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-[#B8C7BC] uppercase">ROI %</span>
                <div className="relative group flex items-center justify-center">
                  <Info className="w-3 h-3 text-[#B8C7BC] cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#0B241C] border border-[#C49A5A]/30 rounded-lg text-[10px] text-[#F7F0E4] hidden group-hover:block z-10 text-left normal-case shadow-xl pointer-events-none">
                    <p className="font-bold text-[#D9B36D] mb-2 border-b border-[#C49A5A]/20 pb-1">ROI (Return on Investment)</p>
                    <p className="mb-1 text-[#B8C7BC]">Calculated using:</p>
                    <p className="mb-2">Estimated Net Profit ÷ Total Investment × 100</p>
                    <p className="text-[#D9B36D]/80 italic">This is an indicative projection only.</p>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-[#22C55E]"><AnimatedNumber value={Math.max(0, Math.round(metrics.roi))} suffix="%" /></span>
            </motion.div>
          </div>

          {/* Revenue Highlight Card */}
          <div className="bg-gradient-to-br from-[rgba(6,31,24,0.9)] to-[rgba(3,15,12,0.95)] border border-[#C49A5A]/50 rounded-[24px] p-6 shadow-[inset_0_0_40px_rgba(196,154,90,0.08)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="flex flex-col text-center md:text-left w-full md:w-auto flex-1">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="text-xs text-[#B8C7BC] uppercase tracking-widest">Estimated Gross Revenue</span>
                  <div className="relative group flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 text-[#C49A5A] cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#0B241C] border border-[#C49A5A]/30 rounded-lg text-[10px] text-[#F7F0E4] hidden group-hover:block z-10 text-left normal-case shadow-xl pointer-events-none">
                      <p className="font-bold text-[#D9B36D] mb-2 border-b border-[#C49A5A]/20 pb-1">Estimated Gross Revenue</p>
                      <p className="mb-1 text-[#B8C7BC]">Trees × Yield Per Tree × Market Price</p>
                      <p className="mt-2 text-[#D9B36D]/80 italic">This value represents estimated revenue before maintenance and operational expenses.</p>
                    </div>
                  </div>
                </div>
                
                <span className="text-4xl md:text-5xl font-serif font-bold text-[#F7F0E4]">
                  <AnimatedNumber value={metrics.grossRevenue} prefix="₹" />
                </span>
                
                <div className="mt-6 flex flex-col gap-2 w-full max-w-sm border-t border-[#C49A5A]/20 pt-4 self-center md:self-start">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#B8C7BC]">Estimated Gross Revenue</span>
                    <span className="text-[#F7F0E4] font-medium">{formatCurrency(metrics.grossRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#B8C7BC]">Annual Maintenance Cost</span>
                    <span className="text-[#F7F0E4] font-medium">- {formatCurrency(metrics.maintenanceCost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-[#C49A5A]/20 pt-2 mt-1">
                    <span className="text-[#D9B36D] font-bold">Estimated Net Profit</span>
                    <span className="text-[#22C55E] font-bold">{formatCurrency(metrics.netProfit)}</span>
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-3 w-full md:w-[280px]">
                <span className="text-[10px] text-[#B8C7BC] text-center md:text-left mb-1 italic">
                  Profit Distribution (Based on Estimated Net Profit)
                </span>
                <div className="bg-[#0B241C] border border-[#C49A5A]/20 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D9B36D]" />
                    <span className="text-xs text-[#B8C7BC]">Investor Share (Estimated)</span>
                  </div>
                  <span className="text-sm font-bold text-[#F7F0E4]">{formatCurrency(metrics.investorShare)}</span>
                </div>
                <div className="bg-[#0B241C] border border-[#C49A5A]/20 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D9B36D]" />
                    <span className="text-xs text-[#B8C7BC]">Management Share (Estimated)</span>
                  </div>
                  <span className="text-sm font-bold text-[#F7F0E4]">{formatCurrency(metrics.managementShare)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Calculation Breakdown Card */}
          <div className="bg-[rgba(6,31,24,0.95)] border border-[#C49A5A]/40 rounded-[24px] p-6 shadow-xl flex flex-col">
            <h4 className="text-[#D9B36D] text-xs uppercase font-bold mb-6 text-center tracking-widest">Revenue Calculation Breakdown</h4>
            <div className="flex flex-col md:flex-row items-center justify-between text-[#F7F0E4] font-serif text-sm md:text-base px-2 gap-4 md:gap-0">
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{metrics.survivingTrees}</span>
                <span className="text-[10px] text-[#B8C7BC] font-sans uppercase tracking-wider mt-1">Trees</span>
              </div>
              <span className="text-[#D9B36D] font-bold text-lg">×</span>
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{yieldPerTree} KG</span>
                <span className="text-[10px] text-[#B8C7BC] font-sans uppercase tracking-wider mt-1">Per Tree</span>
              </div>
              <span className="text-[#D9B36D] font-bold text-lg">=</span>
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{metrics.totalYieldKg.toLocaleString('en-IN')} KG</span>
                <span className="text-[10px] text-[#B8C7BC] font-sans uppercase tracking-wider mt-1">({metrics.totalYieldTon.toFixed(2)} Tons)</span>
              </div>
              <span className="text-[#D9B36D] font-bold text-lg">×</span>
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{formatCurrency(marketPricePerTon)}</span>
                <span className="text-[10px] text-[#B8C7BC] font-sans uppercase tracking-wider mt-1">Per Ton</span>
              </div>
              <span className="text-[#D9B36D] font-bold text-lg">=</span>
              <div className="flex flex-col items-center bg-[#0B241C] border border-[#C49A5A]/30 p-4 rounded-xl shadow-lg mt-4 md:mt-0">
                <span className="text-[10px] text-[#D9B36D] font-sans uppercase tracking-wider mb-1">Estimated Gross Revenue</span>
                <span className="text-xl md:text-2xl font-bold text-[#F7F0E4]">{formatCurrency(metrics.grossRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Growth Line Chart */}
            <div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 h-[250px] flex flex-col">
              <h4 className="text-[#D9B36D] text-xs uppercase font-bold mb-4 text-center">Revenue Growth</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayYearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#B8C7BC" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)} 
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ backgroundColor: 'rgba(10,38,30,0.95)', border: '1px solid rgba(196,154,90,0.5)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="marketValue" name="Gross Revenue" stroke="#D9B36D" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Investment vs Profit Bar Chart */}
            <div className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-4 h-[250px] flex flex-col">
              <h4 className="text-[#D9B36D] text-xs uppercase font-bold mb-4 text-center">Investment vs Profit</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayYearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#B8C7BC" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(Math.max(0, val))}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ backgroundColor: 'rgba(10,38,30,0.95)', border: '1px solid rgba(196,154,90,0.5)', borderRadius: '8px' }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="runningInvestment" name="Investment" stackId="a" fill="#B8C7BC" radius={[0,0,4,4]} />
                  <Bar dataKey="runningNetProfit" name="Net Profit" stackId="a" fill="#22C55E" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* YEARLY GROWTH TABLE */}
      <div className="bg-[rgba(6,31,24,0.95)] border border-[#C49A5A]/30 rounded-[24px] p-6 shadow-xl overflow-hidden flex flex-col mt-4">
        <h3 className="text-[#F7F0E4] text-[16px] font-bold tracking-wide uppercase mb-1">
          Estimated Year-wise Plantation Performance
        </h3>
        <p className="text-[#88998C] text-xs italic mb-4 border-b border-[#C49A5A]/20 pb-4">
          Illustrative projections based on the current calculator inputs and selected assumptions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#C49A5A]/30 text-[#D9B36D] text-[11px] uppercase tracking-wider">
                <th className="p-3 font-semibold">Year</th>
                <th className="p-3 font-semibold">Yield / Tree (KG)</th>
                <th className="p-3 font-semibold">Total Yield (KG)</th>
                <th className="p-3 font-semibold">Estimated Gross Revenue</th>
                <th className="p-3 font-semibold">Annual Maintenance</th>
                <th className="p-3 font-semibold">Estimated Net Profit</th>
                <th className="p-3 font-semibold">Estimated ROI</th>
              </tr>
            </thead>
            <tbody>
              {displayYearlyData.map((row) => (
                <tr key={row.year} className="border-b border-[#C49A5A]/10 hover:bg-[#12372A]/40 transition-colors text-sm text-[#F7F0E4]">
                  <td className="p-3">Year {row.year}</td>
                  <td className="p-3">{typeof row.yieldPerTree === 'number' ? row.yieldPerTree.toFixed(1) : row.yieldPerTree}</td>
                  <td className="p-3">{row.totalYieldKg}</td>
                  <td className="p-3 text-[#22C55E] font-medium">{formatCurrency(row.marketValue)}</td>
                  <td className="p-3 text-[#B8C7BC]">{formatCurrency(row.cumulativeMaintenance)}</td>
                  <td className="p-3 text-[#4ADE80]">{formatCurrency(row.runningNetProfit)}</td>
                  <td className="p-3 text-[#D9B36D] font-bold">{Math.max(0, parseFloat(row.roi))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-[#C49A5A]/20 pt-4">
          <h5 className="text-[#D9B36D] text-[11px] font-bold uppercase tracking-widest mb-2">Projection Methodology</h5>
          <p className="text-[#88998C] text-[11px] max-w-4xl leading-relaxed">
            The above values are indicative estimates generated using the selected plantation inputs, estimated market price, cumulative maintenance costs, and projected yield assumptions. Actual plantation performance and financial outcomes may vary depending on cultivation practices, environmental conditions, and market factors.
          </p>
        </div>
      </div>

    </div>
  );
}

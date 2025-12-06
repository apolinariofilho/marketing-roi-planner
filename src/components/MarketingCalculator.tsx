import { useState, useMemo, useEffect, useRef } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Target, Package, Percent, AlertTriangle, CheckCircle, Briefcase, ShoppingCart, Zap, Download, Loader2 } from "lucide-react";
import SliderField from "./SliderField";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MarketingCalculator = () => {
  const [investimento, setInvestimento] = useState(5000);
  const [custoLead, setCustoLead] = useState(25);
  const [taxaAgendamento, setTaxaAgendamento] = useState(30);
  const [taxaComparecimento, setTaxaComparecimento] = useState(60);
  const [taxaFechamento, setTaxaFechamento] = useState(20);
  const [custoEquipe, setCustoEquipe] = useState(3000);
  const [valorProduto, setValorProduto] = useState(1500);
  const [margemLucro, setMargemLucro] = useState(40);
  const [tipoOferta, setTipoOferta] = useState<"servico" | "produto">("servico");
  const [taxaImposto, setTaxaImposto] = useState(7.5);

  const calculos = useMemo(() => {
    const leads = custoLead > 0 ? investimento / custoLead : 0;
    const agendados = leads * (taxaAgendamento / 100);
    const comparecidos = agendados * (taxaComparecimento / 100);
    const fechados = comparecidos * (taxaFechamento / 100);
    
    const investimentoComTaxa = investimento * 1.13;
    const custoTotal = investimentoComTaxa + custoEquipe;
    
    const lucroUnitarioBruto = valorProduto * (margemLucro / 100);
    const impostoUnitario = lucroUnitarioBruto * (taxaImposto / 100);
    const lucroUnitario = lucroUnitarioBruto - impostoUnitario;
    
    const produtosBreakEven = lucroUnitario > 0 ? Math.ceil(custoTotal / lucroUnitario) : 0;
    
    const receitaTotal = fechados * valorProduto;
    const lucroTotal = fechados * lucroUnitario;
    const resultadoFinal = lucroTotal - custoTotal;
    const roi = custoTotal > 0 ? ((lucroTotal - custoTotal) / custoTotal) * 100 : 0;
    
    return {
      leads, agendados, comparecidos, fechados,
      investimentoComTaxa, custoTotal, lucroUnitario, impostoUnitario,
      produtosBreakEven, receitaTotal, lucroTotal, resultadoFinal, roi,
    };
  }, [investimento, custoLead, taxaAgendamento, taxaComparecimento, taxaFechamento, custoEquipe, valorProduto, margemLucro, taxaImposto]);

  // Animation key for funnel
  const [animationKey, setAnimationKey] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const prevCalculos = useRef(calculos);
  const reportRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (
      prevCalculos.current.leads !== calculos.leads ||
      prevCalculos.current.agendados !== calculos.agendados ||
      prevCalculos.current.comparecidos !== calculos.comparecidos ||
      prevCalculos.current.fechados !== calculos.fechados
    ) {
      setAnimationKey(prev => prev + 1);
      prevCalculos.current = calculos;
    }
  }, [calculos]);

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f1419',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const date = new Date().toLocaleDateString('pt-BR');
      pdf.save(`relatorio-marketing-roi-${date}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Chart data with brighter colors
  const funnelData = [
    { name: 'Leads', value: Math.round(calculos.leads), fill: 'hsl(var(--chart-1))' },
    { name: 'Agendados', value: Math.round(calculos.agendados), fill: 'hsl(var(--chart-2))' },
    { name: 'Compareceram', value: Math.round(calculos.comparecidos), fill: 'hsl(var(--chart-3))' },
    { name: 'Fechados', value: Math.round(calculos.fechados), fill: 'hsl(var(--chart-4))' },
  ];

  const costData = [
    { name: 'Anúncios', value: calculos.investimentoComTaxa, fill: 'hsl(var(--chart-1))' },
    { name: 'Equipe', value: custoEquipe, fill: 'hsl(var(--chart-2))' },
  ];

  const profitData = [
    { name: 'Receita', value: Math.max(0, calculos.receitaTotal) },
    { name: 'Lucro', value: Math.max(0, calculos.lucroTotal) },
    { name: 'Custos', value: calculos.custoTotal },
  ];

  const isViable = calculos.resultadoFinal >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold gradient-text">Marketing ROI</h1>
              <p className="text-xs text-muted-foreground">Calculadora de Viabilidade</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isViable ? 'bg-success/20 text-success border border-success/30' : 'bg-destructive/20 text-destructive border border-destructive/30'
            }`}>
              {isViable ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {isViable ? 'Viável' : 'Inviável'}
            </div>
          </div>
        </div>
      </header>

      <div ref={reportRef} className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* KPI Cards */}
          <div className="glass-card p-4 border-l-4 border-l-primary">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">ROI Projetado</p>
            <p className={`text-2xl font-bold tabular-nums ${calculos.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
              {calculos.roi.toFixed(1)}%
            </p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-chart-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lucro Projetado</p>
            <p className={`text-2xl font-bold tabular-nums ${calculos.resultadoFinal >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(calculos.resultadoFinal)}
            </p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-chart-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Break-Even</p>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {calculos.produtosBreakEven} <span className="text-sm font-normal text-muted-foreground">vendas</span>
            </p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-chart-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Vendas Previstas</p>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {Math.floor(calculos.fechados)} <span className="text-sm font-normal text-muted-foreground">vendas</span>
            </p>
          </div>
        </div>

        {/* Visual Funnel */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-6 flex items-center gap-2">
            🎯 Funil de Conversão
          </h3>
          <div key={animationKey} className="flex flex-col items-center gap-1">
            {/* Leads */}
            <div className="relative w-full max-w-md funnel-step">
              <div 
                className="h-16 flex items-center justify-center rounded-t-xl transition-all shadow-lg funnel-animate"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(210 100% 60%), hsl(210 100% 50%))',
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
                  boxShadow: '0 4px 20px hsl(210 100% 60% / 0.4)'
                }}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{Math.round(calculos.leads)}</p>
                  <p className="text-sm font-semibold text-white/90">Leads</p>
                </div>
              </div>
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground/80 hidden md:block">
                100% dos leads
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-sm font-bold py-1">
              <span className="text-[hsl(168_80%_50%)]">{taxaAgendamento}%</span>
              <span className="text-foreground/70">agendam</span>
            </div>

            {/* Agendados */}
            <div className="relative w-[90%] max-w-[calc(28rem*0.9)] funnel-step">
              <div 
                className="h-16 flex items-center justify-center transition-all shadow-lg funnel-animate"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(168 80% 50%), hsl(168 80% 40%))',
                  clipPath: 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)',
                  boxShadow: '0 4px 20px hsl(168 80% 50% / 0.4)'
                }}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{Math.round(calculos.agendados)}</p>
                  <p className="text-sm font-semibold text-white/90">Agendados</p>
                </div>
              </div>
              <div className="absolute -right-28 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground/80 hidden md:block">
                {((calculos.agendados / calculos.leads) * 100 || 0).toFixed(0)}% do total
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-sm font-bold py-1">
              <span className="text-[hsl(45_95%_55%)]">{taxaComparecimento}%</span>
              <span className="text-foreground/70">comparecem</span>
            </div>

            {/* Compareceram */}
            <div className="relative w-[75%] max-w-[calc(28rem*0.75)] funnel-step">
              <div 
                className="h-16 flex items-center justify-center transition-all shadow-lg funnel-animate"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(45 95% 55%), hsl(45 95% 45%))',
                  clipPath: 'polygon(10% 0, 90% 0, 85% 100%, 15% 100%)',
                  boxShadow: '0 4px 20px hsl(45 95% 55% / 0.4)'
                }}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 drop-shadow-lg">{Math.round(calculos.comparecidos)}</p>
                  <p className="text-sm font-semibold text-gray-900/80">Compareceram</p>
                </div>
              </div>
              <div className="absolute -right-28 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground/80 hidden md:block">
                {((calculos.comparecidos / calculos.leads) * 100 || 0).toFixed(0)}% do total
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-sm font-bold py-1">
              <span className="text-[hsl(142_80%_45%)]">{taxaFechamento}%</span>
              <span className="text-foreground/70">fecham</span>
            </div>

            {/* Fechados */}
            <div className="relative w-[55%] max-w-[calc(28rem*0.55)] funnel-step">
              <div 
                className="h-16 flex items-center justify-center rounded-b-xl transition-all shadow-lg funnel-animate"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(142 80% 45%), hsl(142 80% 35%))',
                  clipPath: 'polygon(15% 0, 85% 0, 75% 100%, 25% 100%)',
                  boxShadow: '0 4px 20px hsl(142 80% 45% / 0.4)'
                }}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{Math.round(calculos.fechados)}</p>
                  <p className="text-sm font-semibold text-white/90">Vendas</p>
                </div>
              </div>
              <div className="absolute -right-28 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground/80 hidden md:block">
                {((calculos.fechados / calculos.leads) * 100 || 0).toFixed(1)}% do total
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg border-2" style={{ background: 'hsl(210 100% 60% / 0.15)', borderColor: 'hsl(210 100% 60% / 0.5)' }}>
              <p className="text-xl font-bold" style={{ color: 'hsl(210 100% 70%)' }}>{Math.round(calculos.leads)}</p>
              <p className="text-xs font-medium text-foreground/80">Leads</p>
            </div>
            <div className="p-3 rounded-lg border-2" style={{ background: 'hsl(168 80% 50% / 0.15)', borderColor: 'hsl(168 80% 50% / 0.5)' }}>
              <p className="text-xl font-bold" style={{ color: 'hsl(168 80% 60%)' }}>{Math.round(calculos.agendados)}</p>
              <p className="text-xs font-medium text-foreground/80">Agendados</p>
            </div>
            <div className="p-3 rounded-lg border-2" style={{ background: 'hsl(45 95% 55% / 0.15)', borderColor: 'hsl(45 95% 55% / 0.5)' }}>
              <p className="text-xl font-bold" style={{ color: 'hsl(45 95% 60%)' }}>{Math.round(calculos.comparecidos)}</p>
              <p className="text-xs font-medium text-foreground/80">Compareceram</p>
            </div>
            <div className="p-3 rounded-lg border-2" style={{ background: 'hsl(142 80% 45% / 0.15)', borderColor: 'hsl(142 80% 45% / 0.5)' }}>
              <p className="text-xl font-bold" style={{ color: 'hsl(142 80% 55%)' }}>{Math.round(calculos.fechados)}</p>
              <p className="text-xs font-medium text-foreground/80">Vendas</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">

          {/* Cost Distribution */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Distribuição de Custos
            </h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {costData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Análise Financeira
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Investimento */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Investimento
            </h3>
            <div className="space-y-5">
              <SliderField label="Anúncios" value={investimento} onChange={setInvestimento} min={500} max={50000} step={500} formatValue={formatCurrency} />
              <SliderField label="Custo/Lead" value={custoLead} onChange={setCustoLead} min={5} max={200} step={5} formatValue={formatCurrency} />
              <SliderField label="Equipe" value={custoEquipe} onChange={setCustoEquipe} min={0} max={20000} step={500} formatValue={formatCurrency} />
            </div>
          </div>

          {/* Conversão */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Conversão
            </h3>
            <div className="space-y-5">
              <SliderField label="Agendamento" value={taxaAgendamento} onChange={setTaxaAgendamento} min={5} max={100} suffix="%" />
              <SliderField label="Comparecimento" value={taxaComparecimento} onChange={setTaxaComparecimento} min={10} max={100} suffix="%" />
              <SliderField label="Fechamento" value={taxaFechamento} onChange={setTaxaFechamento} min={5} max={100} suffix="%" />
            </div>
          </div>

          {/* Produto */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Produto/Serviço
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => { setTipoOferta("servico"); setTaxaImposto(7.5); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                  tipoOferta === "servico" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 border-border hover:border-primary/50"
                }`}
              >
                <Briefcase className="w-3 h-3" /> Serviço
              </button>
              <button
                onClick={() => { setTipoOferta("produto"); setTaxaImposto(22.5); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                  tipoOferta === "produto" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 border-border hover:border-primary/50"
                }`}
              >
                <ShoppingCart className="w-3 h-3" /> Produto
              </button>
            </div>
            <div className="space-y-5">
              <SliderField label="Valor" value={valorProduto} onChange={setValorProduto} min={100} max={50000} step={100} formatValue={formatCurrency} />
              <SliderField label="Margem" value={margemLucro} onChange={setMargemLucro} min={10} max={90} suffix="%" />
            </div>
          </div>

          {/* Imposto */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Impostos & Lucro
            </h3>
            <div className="space-y-5">
              <SliderField 
                label="Imposto" 
                value={taxaImposto} 
                onChange={setTaxaImposto} 
                min={tipoOferta === "servico" ? 6 : 20} 
                max={tipoOferta === "servico" ? 9 : 25} 
                step={0.5} 
                suffix="%" 
              />
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Imposto por venda</p>
                <p className="text-lg font-bold text-warning">{formatCurrency(calculos.impostoUnitario)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Lucro líquido/unidade</p>
                <p className="text-lg font-bold text-success">{formatCurrency(calculos.lucroUnitario)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extrato Financeiro */}
        <div className="mt-6 glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-6 flex items-center gap-2">
            📋 Extrato Financeiro
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* O que você vai pagar */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-destructive uppercase tracking-wide border-b border-destructive/30 pb-2">
                💸 O que você vai pagar
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Investimento em anúncios</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(investimento)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Taxa da plataforma (13%)</span>
                  <span className="text-sm font-semibold text-destructive">{formatCurrency(investimento * 0.13)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Custo da equipe de marketing</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(custoEquipe)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Imposto sobre vendas ({taxaImposto}% × {Math.floor(calculos.fechados)} vendas)</span>
                  <span className="text-sm font-semibold text-destructive">{formatCurrency(calculos.impostoUnitario * Math.floor(calculos.fechados))}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-destructive/10 rounded-lg px-3 mt-2">
                  <span className="text-sm font-bold text-destructive">TOTAL A PAGAR</span>
                  <span className="text-lg font-bold text-destructive">{formatCurrency(calculos.custoTotal + (calculos.impostoUnitario * Math.floor(calculos.fechados)))}</span>
                </div>
              </div>
            </div>

            {/* O que você vai receber */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-success uppercase tracking-wide border-b border-success/30 pb-2">
                💰 O que você vai receber
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Quantidade de vendas previstas</span>
                  <span className="text-sm font-semibold text-foreground">{Math.floor(calculos.fechados)} vendas</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Valor por venda</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(valorProduto)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Faturamento total</span>
                  <span className="text-sm font-semibold text-success">{formatCurrency(calculos.receitaTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Lucro líquido por venda</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(calculos.lucroUnitario)}</span>
                </div>
                <div className={`flex justify-between items-center py-3 rounded-lg px-3 mt-2 ${calculos.resultadoFinal >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <span className={`text-sm font-bold ${calculos.resultadoFinal >= 0 ? 'text-success' : 'text-destructive'}`}>LUCRO FINAL</span>
                  <span className={`text-lg font-bold ${calculos.resultadoFinal >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(calculos.resultadoFinal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Final */}
          <div className={`mt-6 p-4 rounded-xl border-2 ${isViable ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isViable ? <CheckCircle className="w-6 h-6 text-success" /> : <AlertTriangle className="w-6 h-6 text-destructive" />}
                <div>
                  <p className="font-bold text-foreground">
                    {isViable ? "✅ Investimento Viável" : "❌ Investimento Inviável"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isViable 
                      ? `Você precisa de ${calculos.produtosBreakEven} vendas para empatar. Projeção: ${Math.floor(calculos.fechados)} vendas.`
                      : `Faltam ${calculos.produtosBreakEven - Math.floor(calculos.fechados)} vendas para empatar.`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className={`text-2xl font-bold ${calculos.roi >= 0 ? 'text-success' : 'text-destructive'}`}>{calculos.roi.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCalculator;

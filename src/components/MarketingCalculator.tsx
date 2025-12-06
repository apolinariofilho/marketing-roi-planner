import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Target, Package, Percent, AlertTriangle, CheckCircle, Briefcase, ShoppingCart, Zap } from "lucide-react";
import SliderField from "./SliderField";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

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

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Chart data
  const funnelData = [
    { name: 'Leads', value: Math.round(calculos.leads), fill: 'hsl(var(--primary))' },
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
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            isViable ? 'bg-success/20 text-success border border-success/30' : 'bg-destructive/20 text-destructive border border-destructive/30'
          }`}>
            {isViable ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {isViable ? 'Viável' : 'Inviável'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
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

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Funnel Chart */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Funil de Conversão
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

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

        {/* Bottom Result Banner */}
        <div className={`mt-6 glass-card p-5 flex items-center justify-between ${isViable ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isViable ? 'bg-success/20' : 'bg-destructive/20'}`}>
              {isViable ? <CheckCircle className="w-6 h-6 text-success" /> : <AlertTriangle className="w-6 h-6 text-destructive" />}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isViable ? "Investimento Viável!" : "Investimento Inviável"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isViable 
                  ? `${Math.floor(calculos.fechados)} vendas previstas geram ${formatCurrency(calculos.resultadoFinal)} de lucro`
                  : `Precisa de ${calculos.produtosBreakEven - Math.floor(calculos.fechados)} vendas adicionais para break-even`
                }
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-muted-foreground">Custo Total</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(calculos.custoTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCalculator;

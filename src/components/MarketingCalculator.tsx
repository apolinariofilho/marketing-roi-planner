import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Target, Package, Percent, AlertTriangle, CheckCircle, Briefcase, ShoppingCart } from "lucide-react";
import SliderField from "./SliderField";
import ResultCard from "./ResultCard";
import FunnelStep from "./FunnelStep";

const MarketingCalculator = () => {
  // Investimento e Leads
  const [investimento, setInvestimento] = useState(5000);
  const [custoLead, setCustoLead] = useState(25);
  
  // Taxas de conversão
  const [taxaAgendamento, setTaxaAgendamento] = useState(30);
  const [taxaComparecimento, setTaxaComparecimento] = useState(60);
  const [taxaFechamento, setTaxaFechamento] = useState(20);
  
  // Equipe de Marketing
  const [custoEquipe, setCustoEquipe] = useState(3000);
  
  // Produto
  const [valorProduto, setValorProduto] = useState(1500);
  const [margemLucro, setMargemLucro] = useState(40);
  
  // Tipo e Imposto
  const [tipoOferta, setTipoOferta] = useState<"servico" | "produto">("servico");
  const [taxaImposto, setTaxaImposto] = useState(7.5);

  // Cálculos
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
    const impostoTotal = fechados * impostoUnitario;
    const lucroTotal = fechados * lucroUnitario;
    const resultadoFinal = lucroTotal - custoTotal;
    const roi = custoTotal > 0 ? ((lucroTotal - custoTotal) / custoTotal) * 100 : 0;
    
    return {
      leads,
      agendados,
      comparecidos,
      fechados,
      investimentoComTaxa,
      custoTotal,
      lucroUnitario,
      impostoUnitario,
      produtosBreakEven,
      receitaTotal,
      impostoTotal,
      lucroTotal,
      resultadoFinal,
      roi,
    };
  }, [investimento, custoLead, taxaAgendamento, taxaComparecimento, taxaFechamento, custoEquipe, valorProduto, margemLucro, taxaImposto]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Compacto */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Calculadora de Viabilidade</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Marketing Investment Calculator</span>
          </h1>
        </div>

        {/* Layout Principal */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda: Inputs */}
          <div className="space-y-4">
            {/* Investimento */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Investimento</h2>
              </div>
              <div className="space-y-5">
                <SliderField
                  label="Anúncios"
                  value={investimento}
                  onChange={setInvestimento}
                  min={500}
                  max={50000}
                  step={500}
                  formatValue={(v) => formatCurrency(v)}
                />
                <SliderField
                  label="Custo/Lead"
                  value={custoLead}
                  onChange={setCustoLead}
                  min={5}
                  max={200}
                  step={5}
                  formatValue={(v) => formatCurrency(v)}
                />
                <SliderField
                  label="Equipe Marketing"
                  value={custoEquipe}
                  onChange={setCustoEquipe}
                  min={0}
                  max={20000}
                  step={500}
                  formatValue={(v) => formatCurrency(v)}
                />
              </div>
            </div>

            {/* Conversão */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Taxas de Conversão</h2>
              </div>
              <div className="space-y-5">
                <SliderField
                  label="Agendamento"
                  value={taxaAgendamento}
                  onChange={setTaxaAgendamento}
                  min={5}
                  max={100}
                  suffix="%"
                />
                <SliderField
                  label="Comparecimento"
                  value={taxaComparecimento}
                  onChange={setTaxaComparecimento}
                  min={10}
                  max={100}
                  suffix="%"
                />
                <SliderField
                  label="Fechamento"
                  value={taxaFechamento}
                  onChange={setTaxaFechamento}
                  min={5}
                  max={100}
                  suffix="%"
                />
              </div>
            </div>

            {/* Produto */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Produto/Serviço</h2>
              </div>
              
              {/* Tipo de Oferta */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  onClick={() => {
                    setTipoOferta("servico");
                    setTaxaImposto(7.5);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-200 text-xs font-medium ${
                    tipoOferta === "servico"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Serviço (6-9%)
                </button>
                <button
                  onClick={() => {
                    setTipoOferta("produto");
                    setTaxaImposto(22.5);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-200 text-xs font-medium ${
                    tipoOferta === "produto"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Produto (20-25%)
                </button>
              </div>

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
                <SliderField
                  label="Valor"
                  value={valorProduto}
                  onChange={setValorProduto}
                  min={100}
                  max={50000}
                  step={100}
                  formatValue={(v) => formatCurrency(v)}
                />
                <SliderField
                  label="Margem de Lucro"
                  value={margemLucro}
                  onChange={setMargemLucro}
                  min={10}
                  max={90}
                  suffix="%"
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Resultados */}
          <div className="space-y-4">
            {/* Funil Compacto */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Funil de Vendas</h2>
              </div>
              <div className="space-y-1.5">
                <FunnelStep label="Leads" value={calculos.leads} />
                <FunnelStep label="Agendaram" value={calculos.agendados} percentage={taxaAgendamento} />
                <FunnelStep label="Compareceram" value={calculos.comparecidos} percentage={taxaComparecimento} />
                <FunnelStep label="Fecharam" value={calculos.fechados} percentage={taxaFechamento} isLast />
              </div>
            </div>

            {/* Custos */}
            <div className="glass-card p-5 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Custos</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard
                  label="Anúncios +13%"
                  value={formatCurrency(calculos.investimentoComTaxa)}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <ResultCard
                  label="Custo Total"
                  value={formatCurrency(calculos.custoTotal)}
                  icon={<DollarSign className="w-4 h-4" />}
                  variant="warning"
                />
              </div>
            </div>

            {/* Análise Break-Even */}
            <div className="glass-card p-5 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-semibold uppercase tracking-wide">Break-Even</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <ResultCard
                  label={`Imposto (${taxaImposto}%)`}
                  value={formatCurrency(calculos.impostoUnitario)}
                  icon={<Percent className="w-4 h-4" />}
                  variant="warning"
                />
                <ResultCard
                  label="Lucro Líquido/Un."
                  value={formatCurrency(calculos.lucroUnitario)}
                  icon={<Package className="w-4 h-4" />}
                />
                <ResultCard
                  label="Para Break-Even"
                  value={`${calculos.produtosBreakEven} un.`}
                  icon={<Target className="w-4 h-4" />}
                  variant={calculos.produtosBreakEven <= calculos.fechados ? "success" : "warning"}
                  highlight
                />
                <ResultCard
                  label="Vendas Previstas"
                  value={`${Math.floor(calculos.fechados)} un.`}
                  icon={<Users className="w-4 h-4" />}
                />
              </div>

              {/* ROI Grande */}
              <div className={`p-4 rounded-xl border ${calculos.roi >= 0 ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {calculos.roi >= 0 ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">ROI Projetado</span>
                  </div>
                  <span className={`text-2xl font-bold ${calculos.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {calculos.roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Resultado Final */}
            <div className={`glass-card p-5 ${calculos.resultadoFinal >= 0 ? 'border-success/30' : 'border-destructive/30'}`}>
              <div className="flex items-center gap-3">
                {calculos.resultadoFinal >= 0 ? (
                  <div className="p-2.5 rounded-lg bg-success/20">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-destructive/20">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {calculos.resultadoFinal >= 0 ? "Investimento Viável!" : "Atenção!"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calculos.resultadoFinal >= 0 
                      ? <>Lucro projetado: <span className="font-bold text-success">{formatCurrency(calculos.resultadoFinal)}</span></>
                      : <>Faltam <span className="font-bold text-warning">{calculos.produtosBreakEven - Math.floor(calculos.fechados)}</span> vendas para break-even</>
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCalculator;

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Target, Package, Percent, AlertTriangle, CheckCircle } from "lucide-react";
import InputField from "./InputField";
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
  const [nomeProduto, setNomeProduto] = useState("Produto/Serviço");
  const [valorProduto, setValorProduto] = useState(1500);
  const [margemLucro, setMargemLucro] = useState(40);

  // Cálculos
  const calculos = useMemo(() => {
    const leads = custoLead > 0 ? investimento / custoLead : 0;
    const agendados = leads * (taxaAgendamento / 100);
    const comparecidos = agendados * (taxaComparecimento / 100);
    const fechados = comparecidos * (taxaFechamento / 100);
    
    const investimentoComTaxa = investimento * 1.13;
    const custoTotal = investimentoComTaxa + custoEquipe;
    
    const lucroUnitario = valorProduto * (margemLucro / 100);
    const produtosBreakEven = lucroUnitario > 0 ? Math.ceil(custoTotal / lucroUnitario) : 0;
    
    const receitaTotal = fechados * valorProduto;
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
      produtosBreakEven,
      receitaTotal,
      lucroTotal,
      resultadoFinal,
      roi,
    };
  }, [investimento, custoLead, taxaAgendamento, taxaComparecimento, taxaFechamento, custoEquipe, valorProduto, margemLucro]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Calculadora de Viabilidade</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Marketing Investment</span>
            <br />
            <span className="text-foreground">Calculator</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Analise a viabilidade do seu investimento em marketing e descubra quantos produtos precisa vender para atingir o break-even.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna 1: Investimento e Funil */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Investimento</h2>
              </div>
              
              <div className="space-y-4">
                <InputField
                  label="Valor do Investimento em Anúncios"
                  value={investimento}
                  onChange={setInvestimento}
                  prefix="R$"
                />
                <InputField
                  label="Custo por Lead"
                  value={custoLead}
                  onChange={setCustoLead}
                  prefix="R$"
                />
                <InputField
                  label="Custo da Equipe de Marketing"
                  value={custoEquipe}
                  onChange={setCustoEquipe}
                  prefix="R$"
                />
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Percent className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Taxas de Conversão</h2>
              </div>
              
              <div className="space-y-4">
                <InputField
                  label="Taxa de Agendamento"
                  value={taxaAgendamento}
                  onChange={setTaxaAgendamento}
                  suffix="%"
                  max={100}
                />
                <InputField
                  label="Taxa de Comparecimento"
                  value={taxaComparecimento}
                  onChange={setTaxaComparecimento}
                  suffix="%"
                  max={100}
                />
                <InputField
                  label="Taxa de Fechamento"
                  value={taxaFechamento}
                  onChange={setTaxaFechamento}
                  suffix="%"
                  max={100}
                />
              </div>
            </div>
          </div>

          {/* Coluna 2: Funil de Vendas */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">Funil de Vendas</h2>
            </div>
            
            <div className="space-y-2">
              <FunnelStep label="Leads Gerados" value={calculos.leads} />
              <FunnelStep 
                label="Agendaram" 
                value={calculos.agendados} 
                percentage={taxaAgendamento}
              />
              <FunnelStep 
                label="Compareceram" 
                value={calculos.comparecidos} 
                percentage={taxaComparecimento}
              />
              <FunnelStep 
                label="Fecharam" 
                value={calculos.fechados} 
                percentage={taxaFechamento}
                isLast
              />
            </div>
          </div>

          {/* Coluna 3: Produto e Resultados */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Produto/Serviço</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nome do Produto</label>
                  <input
                    type="text"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-base text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                  />
                </div>
                <InputField
                  label="Valor do Produto"
                  value={valorProduto}
                  onChange={setValorProduto}
                  prefix="R$"
                />
                <InputField
                  label="Margem de Lucro"
                  value={margemLucro}
                  onChange={setMargemLucro}
                  suffix="%"
                  max={100}
                />
              </div>
            </div>

            <div className="glass-card p-6 border-primary/20">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Custos Totais</h2>
              </div>
              
              <div className="space-y-3">
                <ResultCard
                  label="Investimento + 13% de taxa"
                  value={formatCurrency(calculos.investimentoComTaxa)}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <ResultCard
                  label="Custo Total (Anúncios + Equipe)"
                  value={formatCurrency(calculos.custoTotal)}
                  icon={<DollarSign className="w-4 h-4" />}
                  variant="warning"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados Finais */}
        <div className="mt-8 glass-card p-8 glow-primary animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-display font-bold">Análise de Break-Even</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <ResultCard
              label="Lucro por Produto"
              value={formatCurrency(calculos.lucroUnitario)}
              icon={<Package className="w-4 h-4" />}
            />
            <ResultCard
              label="Produtos para Break-Even"
              value={calculos.produtosBreakEven}
              icon={<Target className="w-4 h-4" />}
              variant={calculos.produtosBreakEven <= calculos.fechados ? "success" : "warning"}
              highlight
            />
            <ResultCard
              label="Clientes Fechados Previstos"
              value={Math.floor(calculos.fechados)}
              icon={<Users className="w-4 h-4" />}
            />
            <ResultCard
              label="ROI Projetado"
              value={`${calculos.roi.toFixed(1)}%`}
              icon={calculos.roi >= 0 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              variant={calculos.roi >= 0 ? "success" : "destructive"}
            />
          </div>

          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-3">
              {calculos.resultadoFinal >= 0 ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {calculos.resultadoFinal >= 0 ? "Investimento Viável!" : "Atenção: Investimento pode não ser viável"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {calculos.resultadoFinal >= 0 
                    ? `Com ${Math.floor(calculos.fechados)} vendas previstas, você terá um lucro de ${formatCurrency(calculos.resultadoFinal)} após cobrir todos os custos.`
                    : `Você precisaria de ${calculos.produtosBreakEven} vendas para break-even, mas a previsão é de apenas ${Math.floor(calculos.fechados)} vendas. Considere ajustar suas taxas de conversão ou custos.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCalculator;

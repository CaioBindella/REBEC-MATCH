import * as tt from "./styled";

// Dados para os blocos de estatísticas, facilitando a renderização
const statsData = [
  { label: "Ensaios clínicos registrados", value: 7836 },
  { label: "Ensaios clínicos recrutando", value: 4379 },
  { label: "Ensaios clínicos em análise", value: 184 },
  { label: "Ensaios clínicos em rascunho", value: 5447 },
];

export default function CardTotalTrials() {
  return (
    <tt.Container>
      <tt.Top>
        <tt.IconWrapper>
        </tt.IconWrapper>
        <tt.TopContent>
          <tt.Title>Total de Ensaios Clínicos</tt.Title>
          <tt.TotalNumber>15819</tt.TotalNumber>
        </tt.TopContent>
      </tt.Top>

      <tt.Separator />

      <tt.Bottom>
        {statsData.map((stat) => (
          <tt.StatBlock key={stat.label}>
            <tt.StatLabel>{stat.label}</tt.StatLabel>
            <tt.StatValue>{stat.value}</tt.StatValue>
          </tt.StatBlock>
        ))}
      </tt.Bottom>
    </tt.Container>
  );
}
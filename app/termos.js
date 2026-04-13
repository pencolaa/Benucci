import ProfileDetailScreen, { BulletRow, SectionCard } from '../components/profile-detail-screen';

export default function TermosScreen() {
  return (
    <ProfileDetailScreen
      headerLabel="Perfil"
      title="Termos e Condicoes"
      subtitle="Resumo das regras de uso para compras, navegacao e recursos da sua conta Benucci.">
      <SectionCard
        icon="file-text"
        title="Uso da plataforma"
        description="Ao utilizar o app, voce concorda em fornecer informacoes verdadeiras e usar a conta de forma responsavel.">
        <BulletRow text="A conta e pessoal e nao deve ser compartilhada com terceiros sem autorizacao." />
        <BulletRow text="Informacoes incorretas podem afetar pagamentos, entrega e suporte." />
      </SectionCard>

      <SectionCard
        icon="credit-card"
        title="Pedidos e pagamentos"
        description="Valores, disponibilidade e confirmacao de compra dependem do estoque e da validacao do pedido.">
        <BulletRow text="Itens no carrinho nao reservam estoque automaticamente ate a conclusao da compra." />
        <BulletRow text="Promocoes podem ter prazo limitado e condicoes especificas." />
      </SectionCard>

      <SectionCard
        icon="refresh-cw"
        title="Atualizacoes"
        description="Os termos podem ser ajustados para refletir melhorias do aplicativo ou mudancas operacionais.">
        <BulletRow text="Mudancas relevantes podem ser comunicadas nas notificacoes ou dentro do perfil." />
      </SectionCard>
    </ProfileDetailScreen>
  );
}

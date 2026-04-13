import ProfileDetailScreen, { BulletRow, SectionCard } from '../components/profile-detail-screen';

export default function PrivacidadeScreen() {
  return (
    <ProfileDetailScreen
      headerLabel="Perfil"
      title="Politica e Privacidade"
      subtitle="Aqui voce encontra um resumo claro de como os dados da sua conta sao tratados dentro do app.">
      <SectionCard
        icon="lock"
        title="Dados cadastrais"
        description="Usamos nome, email e informacoes de entrega para identificar sua conta e processar pedidos.">
        <BulletRow text="Esses dados ajudam a preencher compras, contato e acompanhamento de entrega." />
        <BulletRow text="Voce pode revisar informacoes principais diretamente nas areas da conta." />
      </SectionCard>

      <SectionCard
        icon="map-pin"
        title="Localizacao"
        description="Quando autorizada, sua localizacao serve para agilizar o preenchimento do endereco.">
        <BulletRow text="A permissao e opcional e pode ser alterada nas configuracoes do aparelho." />
        <BulletRow text="O app usa a localizacao apenas quando voce solicita esse recurso." />
      </SectionCard>

      <SectionCard
        icon="shield"
        title="Protecao"
        description="Adotamos medidas para reduzir acessos indevidos e manter sua navegacao mais segura.">
        <BulletRow text="Credenciais e preferencias de conta devem ser protegidas pelo proprio usuario." />
        <BulletRow text="Em caso de atividade estranha, altere sua senha e revise acessos recentes." />
      </SectionCard>
    </ProfileDetailScreen>
  );
}

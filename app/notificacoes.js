import { StyleSheet, Switch, Text, View } from 'react-native';
import ProfileDetailScreen, { BulletRow, SectionCard } from '../components/profile-detail-screen';
import { usePreferences } from '../context/preferences-context';

function NotificationRow({ title, description, value, onValueChange }) {
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: '#8ad4e5' }}
        thumbColor={value ? theme.accent : theme.panelBackground}
      />
    </View>
  );
}

export default function NotificacoesScreen() {
  const { orderUpdates, offersEnabled, restockEnabled, updatePreference } = usePreferences();

  return (
    <ProfileDetailScreen
      headerLabel="Perfil"
      title="Notificacoes"
      subtitle="Escolha quais avisos a Benucci pode te enviar sobre pedidos, ofertas e novidades.">
      <SectionCard
        icon="bell"
        title="Central de avisos"
        description="Ative apenas o que faz sentido para voce e mantenha sua caixa organizada.">
        <NotificationRow
          title="Atualizacoes do pedido"
          description="Receba status de pagamento, separacao e entrega."
          value={orderUpdates}
          onValueChange={(value) => updatePreference('orderUpdates', value)}
        />
        <NotificationRow
          title="Promocoes e cupons"
          description="Saiba quando surgirem campanhas, kits e descontos especiais."
          value={offersEnabled}
          onValueChange={(value) => updatePreference('offersEnabled', value)}
        />
        <NotificationRow
          title="Reposicao de estoque"
          description="Seja avisado quando um item favorito voltar a ficar disponivel."
          value={restockEnabled}
          onValueChange={(value) => updatePreference('restockEnabled', value)}
        />
      </SectionCard>

      <SectionCard
        icon="mail"
        title="Como enviamos"
        description="Seus avisos podem aparecer dentro do app ou em comunicacoes da sua conta.">
        <BulletRow text="Pedidos importantes continuam aparecendo na area de historico para consulta." />
        <BulletRow text="Promocoes podem variar conforme disponibilidade dos produtos e estoque." />
      </SectionCard>
    </ProfileDetailScreen>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 14,
    },
    textWrap: {
      flex: 1,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    description: {
      color: theme.textSecondary,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 2,
    },
  });

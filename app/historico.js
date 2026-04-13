import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileDetailScreen, { BulletRow, SectionCard } from '../components/profile-detail-screen';

const orders = [
  {
    id: '#BN-2031',
    date: '08/04/2026',
    status: 'Entregue',
    total: 'R$459,00',
    items: ['Quadro Abstrato', 'Kit Almofadas Linho'],
  },
  {
    id: '#BN-1987',
    date: '01/04/2026',
    status: 'Em separacao',
    total: 'R$219,00',
    items: ['Vaso Escultural Branco'],
  },
];

function StatusBadge({ status }) {
  const isDelivered = status === 'Entregue';

  return (
    <View style={[styles.badge, isDelivered ? styles.badgeDelivered : styles.badgeProgress]}>
      <Text style={[styles.badgeText, isDelivered ? styles.badgeTextDelivered : styles.badgeTextProgress]}>
        {status}
      </Text>
    </View>
  );
}

export default function HistoricoScreen() {
  return (
    <ProfileDetailScreen
      headerLabel="Perfil"
      title="Historico"
      subtitle="Acompanhe pedidos recentes e confira rapidamente o que ja passou pela sua conta.">
      {orders.map((order) => (
        <SectionCard
          key={order.id}
          icon="shopping-bag"
          title={order.id}
          description={`${order.date}  •  Total ${order.total}`}
          rightContent={<StatusBadge status={order.status} />}>
          {order.items.map((item) => (
            <BulletRow key={item} text={item} />
          ))}
        </SectionCard>
      ))}

      <SectionCard
        icon="clock"
        title="Resumo"
        description="Seu historico ajuda a repetir compras e acompanhar o andamento dos pedidos.">
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Feather name="package" size={18} color="#52bdd7" />
            <Text style={styles.summaryNumber}>2</Text>
            <Text style={styles.summaryLabel}>Pedidos</Text>
          </View>
          <View style={styles.summaryBox}>
            <Feather name="check-circle" size={18} color="#52bdd7" />
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Entregue</Text>
          </View>
          <View style={styles.summaryBox}>
            <Feather name="truck" size={18} color="#52bdd7" />
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Ativo</Text>
          </View>
        </View>
      </SectionCard>
    </ProfileDetailScreen>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDelivered: {
    backgroundColor: '#def6e7',
  },
  badgeProgress: {
    backgroundColor: '#e7f7fb',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextDelivered: {
    color: '#2f8f5e',
  },
  badgeTextProgress: {
    color: '#3188a2',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#e9f2f7',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  summaryNumber: {
    color: '#1b2730',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#6c7984',
    fontSize: 11,
  },
});

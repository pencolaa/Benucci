export const initialProducts = [
  {
    id: 'mandala',
    name: 'Mandala',
    price: 'R$25',
    accent: '#2f82c5',
    shape: 'circle',
    category: 'Mandala',
    description: 'Mandala de flores pintada a mao que traz leveza ao ambiente.',
    sizes: ['15', '20', '25', '30', '35', '40'],
    colors: ['Azul', 'Branco', 'Dourado'],
    stock: 8,
  },
  {
    id: 'porta-chaves',
    name: 'Porta chaves',
    price: 'R$30',
    accent: '#d48b27',
    shape: 'arch',
    category: 'Imagem',
    description: 'Porta chaves artesanal com acabamento colorido para entrada da casa.',
    sizes: ['20', '25', '30', '35'],
    colors: ['Terracota', 'Azul', 'Mostarda'],
    stock: 5,
  },
  {
    id: 'chaveiro',
    name: 'Chaveiro',
    price: 'R$10',
    accent: '#e2502a',
    shape: 'drop',
    category: 'Chaveiro',
    description: 'Chaveiro decorativo com tassel e pintura vibrante.',
    sizes: ['10', '15', '20'],
    colors: ['Laranja', 'Vermelho', 'Areia'],
    stock: 18,
  },
  {
    id: 'gato',
    name: 'Gato',
    price: 'R$25',
    accent: '#5a4b9c',
    shape: 'cat',
    category: 'Imagem',
    description: 'Escultura felina decorativa inspirada em mosaicos e tons profundos.',
    sizes: ['20', '25', '30'],
    colors: ['Roxo', 'Azul marinho', 'Cinza'],
    stock: 6,
  },
];

export const adminCredentials = {
  email: 'admin@benucci.com',
  password: 'admin123',
};

export function parsePriceValue(price) {
  return Number(String(price).replace('R$', '').replace(',', '.').trim());
}

export function formatPriceValue(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 'R$0';
  }

  return `R$${numericValue.toFixed(2).replace('.', ',')}`;
}

export function normalizeListInput(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugifyProductName(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

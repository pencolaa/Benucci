const http = require('node:http');
const { randomUUID, createHash } = require('node:crypto');
const { mkdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT || 3001);
const dataDir = join(__dirname, 'data');
const dbPath = join(dataDir, 'benucci.sqlite');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

function now() {
  return new Date().toISOString();
}

function hashPassword(password) {
  return createHash('sha256').update(String(password)).digest('hex');
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePriceToCents(value) {
  const normalized = String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

function formatPrice(cents) {
  return `R$${(Number(cents || 0) / 100).toFixed(2).replace('.', ',')}`;
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function createProductId(name) {
  const base = slugify(name) || `item-${Date.now()}`;
  const exists = db.prepare('SELECT id FROM products WHERE id = ?').get(base);
  return exists ? `${base}-${Date.now()}` : base;
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    price: formatPrice(row.price_cents),
    accent: row.accent,
    shape: row.shape,
    category: row.category,
    description: row.description,
    sizes: JSON.parse(row.sizes_json || '[]'),
    colors: JSON.parse(row.colors_json || '[]'),
    stock: row.stock,
  };
}

function mapPreferences(row) {
  return {
    themeMode: row.theme_mode,
    soundEnabled: Boolean(row.sound_enabled),
    biometricEnabled: Boolean(row.biometric_enabled),
    orderUpdates: Boolean(row.order_updates),
    offersEnabled: Boolean(row.offers_enabled),
    restockEnabled: Boolean(row.restock_enabled),
  };
}

function mapAddress(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    icon: row.icon,
    isSelected: Boolean(row.is_selected),
  };
}

function mapOrder(row) {
  const items = db
    .prepare('SELECT product_name FROM order_items WHERE order_id = ? ORDER BY id')
    .all(row.id)
    .map((item) => item.product_name);

  return {
    id: row.id,
    code: row.code,
    date: new Date(row.created_at).toLocaleDateString('pt-BR'),
    status: row.status,
    total: formatPrice(row.total_cents),
    items,
  };
}

function ensurePreferenceRow(userId) {
  const existing = db.prepare('SELECT user_id FROM preferences WHERE user_id = ?').get(userId);

  if (!existing) {
    db.prepare(
      `INSERT INTO preferences (
        user_id, theme_mode, sound_enabled, biometric_enabled, order_updates, offers_enabled, restock_enabled, updated_at
      ) VALUES (?, 'light', 1, 0, 1, 1, 0, ?)`
    ).run(userId, now());
  }
}

function initializeDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS preferences (
      user_id INTEGER PRIMARY KEY,
      theme_mode TEXT NOT NULL DEFAULT 'light',
      sound_enabled INTEGER NOT NULL DEFAULT 1,
      biometric_enabled INTEGER NOT NULL DEFAULT 0,
      order_updates INTEGER NOT NULL DEFAULT 1,
      offers_enabled INTEGER NOT NULL DEFAULT 1,
      restock_enabled INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      accent TEXT NOT NULL,
      shape TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      sizes_json TEXT NOT NULL,
      colors_json TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY(user_id, product_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      selected INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(user_id, product_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'map-pin',
      is_selected INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      address_id TEXT,
      code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(address_id) REFERENCES addresses(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      subtotal_cents INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
    );
  `);
}

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

  if (userCount > 0) {
    return;
  }

  const createdAt = now();
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  insertUser.run('Administrador', 'admin@benucci.com', hashPassword('admin123'), 1, createdAt, createdAt);
  insertUser.run('Erinaldo', 'erinadpereira934@gmail.com', hashPassword('123456789'), 0, createdAt, createdAt);

  ensurePreferenceRow(1);
  ensurePreferenceRow(2);
}

initializeDatabase();
seedDatabase();

function seedProductsAndData() {
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

  if (productCount === 0) {
    const createdAt = now();
    const products = [
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

    const insertProduct = db.prepare(
      `INSERT INTO products (
        id, name, price_cents, accent, shape, category, description, sizes_json, colors_json, stock, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    );

    for (const product of products) {
      insertProduct.run(
        product.id,
        product.name,
        parsePriceToCents(product.price),
        product.accent,
        product.shape,
        product.category,
        product.description,
        JSON.stringify(product.sizes),
        JSON.stringify(product.colors),
        product.stock,
        createdAt,
        createdAt
      );
    }
  }

  const favoriteCount = db.prepare('SELECT COUNT(*) AS count FROM favorites WHERE user_id = 2').get().count;
  if (favoriteCount === 0) {
    const insertFavorite = db.prepare(
      'INSERT INTO favorites (user_id, product_id, created_at) VALUES (?, ?, ?)'
    );
    ['mandala', 'gato', 'porta-chaves', 'chaveiro'].forEach((productId) => {
      insertFavorite.run(2, productId, now());
    });
  }

  const cartCount = db.prepare('SELECT COUNT(*) AS count FROM cart_items WHERE user_id = 2').get().count;
  if (cartCount === 0) {
    const insertCartItem = db.prepare(
      'INSERT INTO cart_items (user_id, product_id, quantity, selected, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const timestamp = now();
    insertCartItem.run(2, 'mandala', 1, 1, timestamp, timestamp);
    insertCartItem.run(2, 'chaveiro', 1, 1, timestamp, timestamp);
    insertCartItem.run(2, 'porta-chaves', 1, 0, timestamp, timestamp);
  }

  const addressCount = db.prepare('SELECT COUNT(*) AS count FROM addresses WHERE user_id = 2').get().count;
  if (addressCount === 0) {
    const insertAddress = db.prepare(
      'INSERT INTO addresses (id, user_id, title, subtitle, icon, is_selected, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const timestamp = now();
    insertAddress.run('home', 2, 'Casa', 'Rua Marcilio Dias, 260 - Canto do Forte', 'home', 1, timestamp, timestamp);
    insertAddress.run('saved', 2, 'R. Marcilio Dias', 'Canto do Forte, Praia Grande - SP', 'map-pin', 0, timestamp, timestamp);
  }

  const orderCount = db.prepare('SELECT COUNT(*) AS count FROM orders WHERE user_id = 2').get().count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(
      'INSERT INTO orders (user_id, address_id, code, status, total_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const orderOne = insertOrder.run(2, 'home', '#BN-2031', 'Entregue', 45900, '2026-04-08T10:00:00.000Z', '2026-04-08T10:00:00.000Z');
    const orderTwo = insertOrder.run(2, 'saved', '#BN-1987', 'Em separacao', 21900, '2026-04-01T10:00:00.000Z', '2026-04-01T10:00:00.000Z');

    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_cents, subtotal_cents) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertOrderItem.run(orderOne.lastInsertRowid, null, 'Quadro Abstrato', 1, 25900, 25900);
    insertOrderItem.run(orderOne.lastInsertRowid, null, 'Kit Almofadas Linho', 1, 20000, 20000);
    insertOrderItem.run(orderTwo.lastInsertRowid, null, 'Vaso Escultural Branco', 1, 21900, 21900);
  }
}

seedProductsAndData();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

function notFound(response) {
  sendJson(response, 404, { error: 'Rota nao encontrada.' });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
    });
    request.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email);
}

function getSessionPayload(userRow, password) {
  return {
    user: {
      id: userRow.id,
      userName: userRow.name,
      email: userRow.email,
      isAdmin: Boolean(userRow.is_admin),
      password,
    },
  };
}

function getProducts() {
  return db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC').all().map(mapProduct);
}

function getUserPreferences(userId) {
  ensurePreferenceRow(userId);
  return mapPreferences(db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(userId));
}

function getUserFavorites(userId) {
  return db.prepare('SELECT product_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(userId).map((row) => row.product_id);
}

function getUserCart(userId) {
  const items = db
    .prepare('SELECT product_id, quantity, selected FROM cart_items WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId)
    .map((row) => ({
      productId: row.product_id,
      quantity: row.quantity,
      selected: Boolean(row.selected),
    }));

  return { items };
}

function getUserAddresses(userId) {
  return db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC').all(userId).map(mapAddress);
}

function getUserOrders(userId) {
  return db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId).map(mapOrder);
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;

  if (request.method === 'GET' && path === '/health') {
    sendJson(response, 200, { ok: true, timestamp: now() });
    return;
  }

  if (request.method === 'POST' && path === '/auth/login') {
    const body = await readBody(request);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = getUserByEmail(email);

    if (!user) {
      sendJson(response, 400, { error: 'Usuario nao encontrado.' });
      return;
    }

    if (user.password_hash !== hashPassword(password)) {
      sendJson(response, 400, {
        error: Boolean(user.is_admin) ? 'Senha de admin incorreta.' : 'Senha incorreta.',
      });
      return;
    }

    sendJson(response, 200, getSessionPayload(user, password));
    return;
  }

  if (request.method === 'POST' && path === '/auth/register') {
    const body = await readBody(request);
    const userName = String(body.userName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();

    if (!userName) {
      sendJson(response, 400, { error: 'Informe seu nome para continuar.' });
      return;
    }

    if (!email.includes('@')) {
      sendJson(response, 400, { error: 'Informe um email valido.' });
      return;
    }

    if (password.length < 4) {
      sendJson(response, 400, { error: 'A senha precisa ter pelo menos 4 caracteres.' });
      return;
    }

    if (getUserByEmail(email)) {
      sendJson(response, 400, { error: 'Ja existe uma conta com esse email.' });
      return;
    }

    const timestamp = now();
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)')
      .run(userName, email, hashPassword(password), timestamp, timestamp);

    ensurePreferenceRow(result.lastInsertRowid);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    sendJson(response, 201, getSessionPayload(user, password));
    return;
  }

  if (request.method === 'GET' && path === '/products') {
    sendJson(response, 200, { products: getProducts() });
    return;
  }

  if (request.method === 'POST' && path === '/products') {
    const body = await readBody(request);
    const timestamp = now();
    const product = {
      id: createProductId(body.name),
      name: String(body.name || '').trim(),
      priceCents: parsePriceToCents(body.price),
      accent: String(body.accent || '#2f82c5').trim(),
      shape: String(body.shape || 'circle').trim(),
      category: String(body.category || 'Imagem').trim(),
      description: String(body.description || '').trim(),
      sizes: parseList(body.sizes),
      colors: parseList(body.colors),
      stock: Math.max(0, Number(body.stock || 0)),
    };

    if (!product.name || product.priceCents <= 0) {
      sendJson(response, 400, { error: 'Preencha nome e preco do produto.' });
      return;
    }

    db.prepare(
      `INSERT INTO products (
        id, name, price_cents, accent, shape, category, description, sizes_json, colors_json, stock, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).run(
      product.id,
      product.name,
      product.priceCents,
      product.accent,
      product.shape,
      product.category,
      product.description,
      JSON.stringify(product.sizes),
      JSON.stringify(product.colors),
      product.stock,
      timestamp,
      timestamp
    );

    sendJson(response, 201, { product: mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(product.id)) });
    return;
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch && request.method === 'PUT') {
    const productId = decodeURIComponent(productMatch[1]);
    const body = await readBody(request);
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    if (!existing) {
      sendJson(response, 404, { error: 'Produto nao encontrado.' });
      return;
    }

    db.prepare(
      `UPDATE products
       SET name = ?, price_cents = ?, accent = ?, shape = ?, category = ?, description = ?, sizes_json = ?, colors_json = ?, stock = ?, updated_at = ?
       WHERE id = ?`
    ).run(
      String(body.name || existing.name).trim(),
      parsePriceToCents(body.price ?? existing.price_cents / 100),
      String(body.accent || existing.accent).trim(),
      String(body.shape || existing.shape).trim(),
      String(body.category || existing.category).trim(),
      String(body.description || existing.description).trim(),
      JSON.stringify(parseList(body.sizes ?? JSON.parse(existing.sizes_json))),
      JSON.stringify(parseList(body.colors ?? JSON.parse(existing.colors_json))),
      Math.max(0, Number(body.stock ?? existing.stock)),
      now(),
      productId
    );

    sendJson(response, 200, { product: mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(productId)) });
    return;
  }

  if (productMatch && request.method === 'DELETE') {
    db.prepare('DELETE FROM products WHERE id = ?').run(decodeURIComponent(productMatch[1]));
    sendJson(response, 200, { ok: true });
    return;
  }

  const userMatch = path.match(/^\/users\/(\d+)(?:\/(.+))?$/);
  if (!userMatch) {
    notFound(response);
    return;
  }

  const userId = Number(userMatch[1]);
  const subpath = userMatch[2] || '';

  if (request.method === 'PUT' && subpath === '') {
    const body = await readBody(request);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    if (!user) {
      sendJson(response, 404, { error: 'Usuario nao encontrado.' });
      return;
    }

    const nextName = String(body.userName || '').trim();
    const nextEmail = String(body.email || '').trim().toLowerCase();
    const nextPassword = String(body.password || '').trim();

    if (!nextName) {
      sendJson(response, 400, { error: 'Informe seu nome para atualizar o perfil.' });
      return;
    }

    if (!nextEmail.includes('@')) {
      sendJson(response, 400, { error: 'Informe um email valido para continuar.' });
      return;
    }

    if (nextPassword.length < 4) {
      sendJson(response, 400, { error: 'A senha precisa ter pelo menos 4 caracteres.' });
      return;
    }

    const duplicate = db.prepare('SELECT id FROM users WHERE lower(email) = lower(?) AND id != ?').get(nextEmail, userId);
    if (duplicate) {
      sendJson(response, 400, { error: 'Esse email ja esta em uso por outra conta.' });
      return;
    }

    if (Boolean(user.is_admin) && nextEmail !== user.email) {
      sendJson(response, 400, { error: 'O email do admin nao pode ser alterado por aqui.' });
      return;
    }

    db.prepare('UPDATE users SET name = ?, email = ?, password_hash = ?, updated_at = ? WHERE id = ?').run(
      nextName,
      nextEmail,
      hashPassword(nextPassword),
      now(),
      userId
    );

    sendJson(
      response,
      200,
      getSessionPayload(db.prepare('SELECT * FROM users WHERE id = ?').get(userId), nextPassword)
    );
    return;
  }

  if (request.method === 'GET' && subpath === 'preferences') {
    sendJson(response, 200, { preferences: getUserPreferences(userId) });
    return;
  }

  if ((request.method === 'PATCH' || request.method === 'PUT') && subpath === 'preferences') {
    const body = await readBody(request);
    const current = getUserPreferences(userId);
    const next = {
      themeMode: body.themeMode ?? current.themeMode,
      soundEnabled: body.soundEnabled ?? current.soundEnabled,
      biometricEnabled: body.biometricEnabled ?? current.biometricEnabled,
      orderUpdates: body.orderUpdates ?? current.orderUpdates,
      offersEnabled: body.offersEnabled ?? current.offersEnabled,
      restockEnabled: body.restockEnabled ?? current.restockEnabled,
    };

    db.prepare(
      `UPDATE preferences
       SET theme_mode = ?, sound_enabled = ?, biometric_enabled = ?, order_updates = ?, offers_enabled = ?, restock_enabled = ?, updated_at = ?
       WHERE user_id = ?`
    ).run(
      next.themeMode,
      next.soundEnabled ? 1 : 0,
      next.biometricEnabled ? 1 : 0,
      next.orderUpdates ? 1 : 0,
      next.offersEnabled ? 1 : 0,
      next.restockEnabled ? 1 : 0,
      now(),
      userId
    );

    sendJson(response, 200, { preferences: getUserPreferences(userId) });
    return;
  }

  if (request.method === 'GET' && subpath === 'favorites') {
    sendJson(response, 200, { favoriteIds: getUserFavorites(userId) });
    return;
  }

  if (request.method === 'POST' && subpath === 'favorites') {
    const body = await readBody(request);
    const productId = String(body.productId || '');
    const existing = db.prepare('SELECT product_id FROM favorites WHERE user_id = ? AND product_id = ?').get(userId, productId);

    if (existing) {
      db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?').run(userId, productId);
    } else {
      db.prepare('INSERT INTO favorites (user_id, product_id, created_at) VALUES (?, ?, ?)').run(userId, productId, now());
    }

    sendJson(response, 200, { favoriteIds: getUserFavorites(userId) });
    return;
  }

  const favoriteDeleteMatch = subpath.match(/^favorites\/([^/]+)$/);
  if (favoriteDeleteMatch && request.method === 'DELETE') {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?').run(
      userId,
      decodeURIComponent(favoriteDeleteMatch[1])
    );
    sendJson(response, 200, { favoriteIds: getUserFavorites(userId) });
    return;
  }

  if (request.method === 'GET' && subpath === 'cart') {
    sendJson(response, 200, getUserCart(userId));
    return;
  }

  if (request.method === 'POST' && subpath === 'cart/items') {
    const body = await readBody(request);
    const productId = String(body.productId || '');
    const quantityToAdd = Math.max(1, Number(body.quantity || 1));
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);
    const timestamp = now();

    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ?, selected = 1, updated_at = ? WHERE user_id = ? AND product_id = ?').run(
        existing.quantity + quantityToAdd,
        timestamp,
        userId,
        productId
      );
    } else {
      db.prepare(
        'INSERT INTO cart_items (user_id, product_id, quantity, selected, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)'
      ).run(userId, productId, quantityToAdd, timestamp, timestamp);
    }

    sendJson(response, 200, getUserCart(userId));
    return;
  }

  const cartItemMatch = subpath.match(/^cart\/items\/([^/]+)$/);
  if (cartItemMatch && request.method === 'PATCH') {
    const productId = decodeURIComponent(cartItemMatch[1]);
    const body = await readBody(request);
    const quantity = Number(body.quantity);
    const selected = body.selected;
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);

    if (!existing) {
      sendJson(response, 404, { error: 'Item do carrinho nao encontrado.' });
      return;
    }

    if (Number.isFinite(quantity) && quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(userId, productId);
      sendJson(response, 200, getUserCart(userId));
      return;
    }

    db.prepare('UPDATE cart_items SET quantity = ?, selected = ?, updated_at = ? WHERE user_id = ? AND product_id = ?').run(
      Number.isFinite(quantity) ? quantity : existing.quantity,
      typeof selected === 'boolean' ? (selected ? 1 : 0) : existing.selected,
      now(),
      userId,
      productId
    );

    sendJson(response, 200, getUserCart(userId));
    return;
  }

  if (request.method === 'GET' && subpath === 'addresses') {
    sendJson(response, 200, { addresses: getUserAddresses(userId) });
    return;
  }

  if (request.method === 'POST' && subpath === 'addresses') {
    const body = await readBody(request);
    const title = String(body.title || '').trim();
    const subtitle = String(body.subtitle || '').trim();

    if (!title || !subtitle) {
      sendJson(response, 400, { error: 'Preencha o nome e o endereco antes de salvar.' });
      return;
    }

    const id = slugify(title) || randomUUID();
    const timestamp = now();
    const shouldSelect = body.isSelected !== false;

    if (shouldSelect) {
      db.prepare('UPDATE addresses SET is_selected = 0, updated_at = ? WHERE user_id = ?').run(timestamp, userId);
    }

    db.prepare(
      'INSERT INTO addresses (id, user_id, title, subtitle, icon, is_selected, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, userId, title, subtitle, String(body.icon || 'map-pin'), shouldSelect ? 1 : 0, timestamp, timestamp);

    sendJson(response, 201, { addresses: getUserAddresses(userId) });
    return;
  }

  const addressMatch = subpath.match(/^addresses\/([^/]+)$/);
  if (addressMatch && request.method === 'PUT') {
    const addressId = decodeURIComponent(addressMatch[1]);
    const body = await readBody(request);
    const title = String(body.title || '').trim();
    const subtitle = String(body.subtitle || '').trim();
    const timestamp = now();
    const isSelected = body.isSelected;

    if (!title || !subtitle) {
      sendJson(response, 400, { error: 'Preencha o nome e o endereco antes de salvar.' });
      return;
    }

    if (isSelected) {
      db.prepare('UPDATE addresses SET is_selected = 0, updated_at = ? WHERE user_id = ?').run(timestamp, userId);
    }

    db.prepare(
      'UPDATE addresses SET title = ?, subtitle = ?, icon = ?, is_selected = ?, updated_at = ? WHERE id = ? AND user_id = ?'
    ).run(title, subtitle, String(body.icon || 'map-pin'), isSelected ? 1 : 0, timestamp, addressId, userId);

    sendJson(response, 200, { addresses: getUserAddresses(userId) });
    return;
  }

  if (addressMatch && request.method === 'DELETE') {
    const addressId = decodeURIComponent(addressMatch[1]);
    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(addressId, userId);

    const remaining = getUserAddresses(userId);
    if (remaining.length > 0 && !remaining.some((item) => item.isSelected)) {
      db.prepare('UPDATE addresses SET is_selected = 1, updated_at = ? WHERE id = ? AND user_id = ?').run(
        now(),
        remaining[0].id,
        userId
      );
    }

    sendJson(response, 200, { addresses: getUserAddresses(userId) });
    return;
  }

  if (request.method === 'GET' && subpath === 'orders') {
    sendJson(response, 200, { orders: getUserOrders(userId) });
    return;
  }

  if (request.method === 'POST' && subpath === 'checkout') {
    const body = await readBody(request);
    const addressId = String(body.addressId || '');
    const address = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(addressId, userId);
    const selectedItems = db
      .prepare(
        `SELECT ci.product_id, ci.quantity, p.name, p.price_cents
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.user_id = ? AND ci.selected = 1`
      )
      .all(userId);

    if (!address) {
      sendJson(response, 400, { error: 'Selecione um endereco para continuar.' });
      return;
    }

    if (selectedItems.length === 0) {
      sendJson(response, 400, { error: 'Selecione ao menos um item do carrinho.' });
      return;
    }

    const totalCents = selectedItems.reduce((total, item) => total + item.price_cents * item.quantity, 0);
    const timestamp = now();
    const code = `#BN-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderResult = db
      .prepare('INSERT INTO orders (user_id, address_id, code, status, total_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(userId, addressId, code, 'Em separacao', totalCents, timestamp, timestamp);

    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_cents, subtotal_cents) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const updateStock = db.prepare('UPDATE products SET stock = MAX(stock - ?, 0), updated_at = ? WHERE id = ?');
    const deleteCartItem = db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?');

    for (const item of selectedItems) {
      insertOrderItem.run(
        orderResult.lastInsertRowid,
        item.product_id,
        item.name,
        item.quantity,
        item.price_cents,
        item.price_cents * item.quantity
      );
      updateStock.run(item.quantity, timestamp, item.product_id);
      deleteCartItem.run(userId, item.product_id);
    }

    sendJson(response, 201, {
      order: mapOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderResult.lastInsertRowid)),
      cart: getUserCart(userId),
      orders: getUserOrders(userId),
      products: getProducts(),
    });
    return;
  }

  notFound(response);
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error(error);
    sendJson(response, 500, { error: 'Erro interno no servidor.' });
  });
});

server.listen(PORT, () => {
  console.log(`Benucci backend rodando em http://localhost:${PORT}`);
});

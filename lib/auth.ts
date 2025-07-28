export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface Watch {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  category: 'Simple' | 'Luxury' | 'Vintage';
  image: string;
  originalPrice?: number; // Added for discount tracking
  discountPercentage?: number; // Added for discount tracking
}

export interface CartItem {
  id: string;
  watchId: string;
  quantity: number;
  watch?: Watch;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shippingInfo: {
    name: string;
    address: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: Date;
}

// Add this to your existing exports in auth.ts
export const getCartWithDetails = (): (CartItem & { watch?: Watch })[] => {
  if (typeof window === 'undefined') return [];
  const cart = getCart();
  const watches = getWatches();
  
  return cart.map(item => {
    const watch = watches.find(w => w.id === item.watchId);
    return { ...item, watch };
  }).filter(item => item.watch); // Filter out items with deleted watches
};

const STORAGE_KEYS = {
  USERS: 'beguiling_chronos_users',
  WATCHES: 'beguiling_chronos_watches',
  CART: 'beguiling_chronos_cart',
  ORDERS: 'beguiling_chronos_orders',
  CURRENT_USER: 'beguiling_chronos_current_user'
};

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const authenticateUser = (email: string, password: string): User | null => {
  if (email === 'admin@gmail.com' && password === 'ghjvbntyual') {
    const adminUser: User = {   
      id: 'admin',
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'ghjvbntyual',
      isAdmin: true
    };
    return adminUser;
  }

  const users = getUsers();
  return users.find(u => u.email === email && u.password === password) || null;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getWatches = (): Watch[] => {
  if (typeof window === 'undefined') return [];
  const watches = localStorage.getItem(STORAGE_KEYS.WATCHES);
  if (!watches) {
    const defaultWatches: Watch[] = [
      {
        id: '1',
        name: 'Classic Elegance',
        price: 45000,
        description: 'A timeless piece that embodies sophistication and grace.',
        features: ['Water Resistant', 'Stainless Steel', 'Quartz Movement'],
        category: 'Simple',
        image: 'https://readdy.ai/api/search-image?query=elegant%20simple%20luxury%20watch%20with%20clean%20white%20face%20and%20silver%20stainless%20steel%20band%20on%20white%20marble%20background%2C%20minimalist%20design%2C%20professional%20product%20photography%2C%20soft%20lighting&width=400&height=400&seq=1&orientation=squarish'
      },
      {
        id: '2',
        name: 'Royal Heritage',
        price: 125000,
        description: 'Crafted for those who appreciate the finest things in life.',
        features: ['Diamond Markers', 'Gold Plated', 'Swiss Movement'],
        category: 'Luxury',
        image: 'https://readdy.ai/api/search-image?query=luxury%20gold%20watch%20with%20diamond%20markers%20on%20black%20leather%20band%2C%20premium%20jewelry%20photography%20on%20dark%20marble%20surface%20with%20dramatic%20lighting%2C%20expensive%20timepiece&width=400&height=400&seq=2&orientation=squarish'
      },
      {
        id: '3',
        name: 'Vintage Charm',
        price: 75000,
        description: 'A nostalgic journey through time with modern reliability.',
        features: ['Vintage Design', 'Leather Strap', 'Manual Wind'],
        category: 'Vintage',
        image: 'https://readdy.ai/api/search-image?query=vintage%20style%20pocket%20watch%20with%20brass%20case%20and%20roman%20numerals%20on%20aged%20leather%20background%2C%20antique%20timepiece%20photography%2C%20warm%20nostalgic%20lighting&width=400&height=400&seq=3&orientation=squarish'
      },
      {
        id: '4',
        name: 'Modern Minimalist',
        price: 35000,
        description: 'Clean lines and modern aesthetics for the contemporary individual.',
        features: ['Ultra Thin', 'Sapphire Crystal', 'Date Display'],
        category: 'Simple',
        image: 'https://readdy.ai/api/search-image?query=modern%20minimalist%20watch%20with%20ultra%20thin%20case%20and%20clean%20black%20face%20on%20white%20background%2C%20contemporary%20design%2C%20sleek%20metal%20bracelet%2C%20studio%20photography&width=400&height=400&seq=4&orientation=squarish'
      },
      {
        id: '5',
        name: 'Diamond Prestige',
        price: 250000,
        description: 'The ultimate expression of luxury and refinement.',
        features: ['Diamond Bezel', 'Platinum Case', 'Automatic Movement'],
        category: 'Luxury',
        image: 'https://readdy.ai/api/search-image?query=prestigious%20diamond%20luxury%20watch%20with%20platinum%20case%20and%20sparkling%20diamond%20bezel%20on%20black%20velvet%20background%2C%20high-end%20jewelry%20photography%20with%20professional%20lighting&width=400&height=400&seq=5&orientation=squarish'
      },
      {
        id: '6',
        name: 'Retro Classic',
        price: 55000,
        description: 'Bringing back the golden era of watchmaking.',
        features: ['Retro Design', 'Mechanical Movement', 'Exhibition Back'],
        category: 'Vintage',
        image: 'https://readdy.ai/api/search-image?query=retro%20classic%20wristwatch%20with%20exposed%20mechanical%20movement%20and%20vintage%20gold%20case%20on%20wooden%20background%2C%20classic%20timepiece%20photography%20with%20warm%20ambient%20lighting&width=400&height=400&seq=6&orientation=squarish'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(defaultWatches));
    return defaultWatches;
  }
  return JSON.parse(watches);
};

export const saveWatch = (watch: Watch): void => {
  if (typeof window === 'undefined') return;
  const watches = getWatches();
  const existingIndex = watches.findIndex(w => w.id === watch.id);

  if (existingIndex >= 0) {
    watches[existingIndex] = watch;
  } else {
    watches.push(watch);
  }

  localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(watches));
};

export const deleteWatch = (watchId: string): void => {
  if (typeof window === 'undefined') return;
  const watches = getWatches();
  const filteredWatches = watches.filter(w => w.id !== watchId);
  localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(filteredWatches));
};

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (watchId: string, quantity: number = 1): void => {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const watches = getWatches();
  const watch = watches.find(w => w.id === watchId);

  if (!watch) return;

  const existingItem = cart.find(item => item.watchId === watchId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: Date.now().toString(),
      watchId,
      quantity,
      watch
    });
  }

  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);

  if (item) {
    item.quantity = quantity;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }
};

export const updateCartItem = (itemId: string, quantity: number): void => {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);

  if (item && quantity > 0) {
    item.quantity = quantity;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }
};

export const removeFromCart = (itemId: string): void => {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const filteredCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredCart));
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CART);
};

export const formatPrice = (price: number): string => {
  return `PKR ${price.toLocaleString('en-US')}`;
};
export const DEMO_BANNERS = [
  {
    id: 'b1',
    image: '/banner_thali.png',
    title: 'Authentic Homemade Thalis',
    subtitle: 'Taste the warmth of real home kitchens. Traditional recipes, cooked with love and delivered fresh.',
    buttonText: 'Explore Menu',
    link: '/menu'
  },
  {
    id: 'b2',
    image: '/banner_biryani.png',
    title: 'Kolkata\'s Finest Biryani',
    subtitle: 'Fragrant Basmati, tender meat, and the signature Kolkata potato. Pure homemade goodness.',
    buttonText: 'Order Biryani',
    link: '/menu'
  },
  {
    id: 'b3',
    image: '/banner_sweets.png',
    title: 'Sweeten Your Day',
    subtitle: 'From Roshogolla to Mishti Doi, indulge in authentic Bengali desserts made by specialized home chefs.',
    buttonText: 'Order Sweets',
    link: '/menu'
  }
];

export const DEMO_KITCHENS = [
  {
    id: 'dk-1',
    cook_id: 'dk-1',
    kitchen_name: "Sunita's Home Kitchen",
    owner_name: 'Sunita Sharma',
    location: 'Salt Lake, Kolkata',
    rating: 4.8,
    is_available: true,
    is_vegetarian: true,
    dish_count: 12,
    description: 'Authentic Marwari home-cooked meals with traditional spices and pure hygiene.',
    profile_image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dk-2',
    cook_id: 'dk-2',
    kitchen_name: "The Bengali Tadka",
    owner_name: 'Amit Ghoshal',
    location: 'Gariahat, Kolkata',
    rating: 4.9,
    is_available: true,
    is_vegetarian: false,
    dish_count: 18,
    description: 'Fresh seafood and traditional Bengali curries made just like home.',
    profile_image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dk-3',
    cook_id: 'dk-3',
    kitchen_name: "Maa Ka Zaika",
    owner_name: 'Priya Mukherjee',
    location: 'New Alipore, Kolkata',
    rating: 4.7,
    is_available: true,
    is_vegetarian: false,
    dish_count: 9,
    description: 'Homestyle North Indian and Bengali fusion recipes from a family kitchen.',
    profile_image_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dk-4',
    cook_id: 'dk-4',
    kitchen_name: "Green Leaf Kitchen",
    owner_name: 'Rekha Agarwal',
    location: 'Park Street, Kolkata',
    rating: 4.6,
    is_available: false,
    is_vegetarian: true,
    dish_count: 6,
    description: 'Pure vegetarian meals with organic ingredients and zero preservatives.',
    profile_image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
  }
];

export const DEMO_DISHES = [
  {
    id: 'dd-1',
    name: 'Special Paneer Butter Masala',
    description: 'Rich, creamy paneer cubes in an onion-tomato gravy with honey and butter.',
    price: 180,
    category: 'Main Course',
    is_veg: true,
    is_available: true,
    quantity_available: 12,
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-1',
    chef_name: "Sunita's Kitchen",
    created_at: '2026-04-13T06:00:00Z'
  },
  {
    id: 'dd-2',
    name: 'Ilish Macher Jhol',
    description: 'Hilsa fish cooked in a light mustard gravy with green chilies.',
    price: 320,
    category: 'Main Course',
    is_veg: false,
    is_available: true,
    quantity_available: 5,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-2',
    chef_name: "The Bengali Tadka",
    created_at: '2026-04-13T05:30:00Z'
  },
  {
    id: 'dd-3',
    name: 'Kolkata Chicken Biryani',
    description: 'Fragrant Basmati rice cooked with chicken and the signature Kolkata potato.',
    price: 250,
    category: 'Biryani',
    is_veg: false,
    is_available: true,
    quantity_available: 8,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-2',
    chef_name: "The Bengali Tadka",
    created_at: '2026-04-13T05:00:00Z'
  },
  {
    id: 'dd-4',
    name: 'Masala Dosa with Coconut Chutney',
    description: 'Crispy crepe filled with spiced potato, served with sambar and fresh chutney.',
    price: 120,
    category: 'Breakfast',
    is_veg: true,
    is_available: true,
    quantity_available: 15,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-1',
    chef_name: "Sunita's Kitchen",
    created_at: '2026-04-13T04:30:00Z'
  },
  {
    id: 'dd-5',
    name: 'Mishti Doi',
    description: 'Traditional Bengali sweetened yogurt set in earthen pots, rich and creamy.',
    price: 80,
    category: 'Desserts',
    is_veg: true,
    is_available: true,
    quantity_available: 20,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-3',
    chef_name: "Maa Ka Zaika",
    created_at: '2026-04-13T04:00:00Z'
  },
  {
    id: 'dd-6',
    name: 'Chicken Kathi Roll',
    description: 'Flaky paratha wrapped around spiced chicken tikka with onions and green chutney.',
    price: 150,
    category: 'Snacks',
    is_veg: false,
    is_available: true,
    quantity_available: 10,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-2',
    chef_name: "The Bengali Tadka",
    created_at: '2026-04-13T03:30:00Z'
  },
  {
    id: 'dd-7',
    name: 'Aloo Paratha with Curd',
    description: 'Stuffed potato flatbread served with fresh yogurt and pickle.',
    price: 90,
    category: 'Breakfast',
    is_veg: true,
    is_available: true,
    quantity_available: 18,
    image_url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-1',
    chef_name: "Sunita's Kitchen",
    created_at: '2026-04-13T03:00:00Z'
  },
  {
    id: 'dd-8',
    name: 'Prawn Malai Curry',
    description: 'Succulent prawns in a delicate coconut cream sauce with Bengali five-spice.',
    price: 350,
    category: 'Main Course',
    is_veg: false,
    is_available: false,
    quantity_available: 0,
    image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-3',
    chef_name: "Maa Ka Zaika",
    created_at: '2026-04-13T02:30:00Z'
  },
  {
    id: 'dd-9',
    name: 'Masala Chai',
    description: 'Strong Indian tea brewed with fresh ginger, cardamom, and whole milk.',
    price: 40,
    category: 'Beverages',
    is_veg: true,
    is_available: true,
    quantity_available: 30,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-4',
    chef_name: "Green Leaf Kitchen",
    created_at: '2026-04-13T02:00:00Z'
  },
  {
    id: 'dd-10',
    name: 'Veg Thali Deluxe',
    description: 'Complete meal with dal, paneer, two sabzis, raita, rice, roti, and dessert.',
    price: 220,
    category: 'Lunch',
    is_veg: true,
    is_available: true,
    quantity_available: 6,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    cook_id: 'dk-4',
    chef_name: "Green Leaf Kitchen",
    created_at: '2026-04-13T01:30:00Z'
  }
];

export const DEMO_ORDERS = [
  { id: 'O-1234', name: 'Paneer Butter Masala + Roti', status: 'Delivered', total: 210, date: '2 hours ago' },
  { id: 'O-1235', name: 'Chicken Biryani Special', status: 'Cooking', total: 250, date: '15 mins ago' },
  { id: 'O-1236', name: 'Bengali Fish Thali', status: 'On the way', total: 380, date: '30 mins ago' },
  { id: 'O-1237', name: 'Masala Dosa Combo', status: 'Delivered', total: 160, date: 'Yesterday' },
  { id: 'O-1238', name: 'Prawn Malai Curry + Rice', status: 'Cancelled', total: 420, date: '2 days ago' },
];

export const DEMO_NOTIFICATIONS = [
  { id: 'n1', message: '🎉 Your first order is delivered! Hope you enjoyed the meal.', time: '1 hour ago' },
  { id: 'n2', message: '🍲 Chef Amit started preparing your Biryani.', time: '15 mins ago' },
  { id: 'n3', message: '🚴 Your order is out for delivery! ETA: 10 minutes.', time: '30 mins ago' },
  { id: 'n4', message: '🎁 You\'ve earned a ₹50 reward for referring a friend!', time: '3 hours ago' },
];

export const DEMO_WALLET = {
  balance: 500,
  currency: 'INR'
};

export const DEMO_MENU_SECTIONS = [
  { id: 'sec-1', name: 'Breakfast', order: 0 },
  { id: 'sec-2', name: 'Main Course', order: 1 },
  { id: 'sec-3', name: 'Biryani', order: 2 },
  { id: 'sec-4', name: 'Snacks', order: 3 },
  { id: 'sec-5', name: 'Desserts', order: 4 },
  { id: 'sec-6', name: 'Beverages', order: 5 },
  { id: 'sec-7', name: 'Lunch', order: 6 },
];

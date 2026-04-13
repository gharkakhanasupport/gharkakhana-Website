export const theme = {
  primaryYellow: '#EAC08F',
  primaryGreen: '#5FA63B',
  background: '#F6D6A8',
  backgroundAlt: '#EAC08F',
  text: '#6E4A2E',
  muted: '#8D6A4A',
  subtle: '#A67D58',
  line: '#D9B07A',
  card: '#ffffff',
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy-policy' },
];

export const homeSections = [
  {
    title: 'Truly Homemade',
    description: 'Every meal is cooked in a real home kitchen by a trusted local chef. No restaurant shortcuts.',
    icon: '🏠',
  },
  {
    title: 'Verified Chefs',
    description: 'All chefs are background-checked and food safety trained for your peace of mind.',
    icon: '✅',
  },
  {
    title: 'Fresh & Local',
    description: 'Ingredients are sourced daily from local markets for authentic, healthy meals.',
    icon: '🧺',
  },
  {
    title: 'Fast Delivery',
    description: 'Hot, fresh food delivered quickly across Kolkata. Track your order in real time.',
    icon: '🚚',
  },
  {
    title: 'Secure Payments',
    description: 'Pay safely with Razorpay. Multiple payment options, always encrypted.',
    icon: '🔒',
  },
  {
    title: 'Real Reviews',
    description: 'See honest feedback from real customers. No fake ratings, just real experiences.',
    icon: '⭐',
  },
];

export const appPreviews = [
  { title: 'Home & Kitchens', description: 'Browse verified kitchens.', image: '/images/Home.png', alt: 'Home and kitchens app screen' },
  { title: 'Wallet & Subscriptions', description: 'Manage payments and plans.', image: '/images/wallet.png', alt: 'Wallet app screen' },
  { title: 'Premium Membership', description: 'Exclusive features.', image: '/images/premium.png', alt: 'Premium app screen' },
];

export const steps = [
  {
    title: 'Browse Menus',
    description: 'Explore local home chefs and their delicious menus. Filter by cuisine, ratings, or dietary preferences.',
    number: '1',
  },
  {
    title: 'Place Your Order',
    description: 'Select your favorites, customize if needed, and checkout securely with multiple payment options.',
    number: '2',
  },
  {
    title: 'Enjoy Fresh Food',
    description: 'Sit back and relax as hot, homemade meals are delivered straight to your door.',
    number: '3',
  },
];

export const testimonials = [
  {
    name: 'Early User',
    location: 'Kolkata',
    quote: 'Excited to try home-cooked food in Kolkata! Looking forward to the official launch.',
  },
  {
    name: 'Beta Customer',
    location: 'Kolkata',
    quote: 'The app is easy to use and the food tastes just like home. Great initiative for Kolkata!',
  },
  {
    name: 'Food Blogger',
    location: 'Kolkata',
    quote: 'Finally, a platform that gives home chefs the recognition they deserve. The quality is unmatched.',
  },
];

export const aboutStats = [
  { label: 'Founded', value: '2024' },
  { label: 'Location', value: 'Kolkata' },
  { label: 'Chefs', value: '100% Verified' },
  { label: 'Rating', value: '4.9★' },
];

export const aboutDifferences = [
  'Authentic Recipes: Traditional family recipes passed down through generations.',
  'Fresher Food: Meals prepared in smaller batches with fresh ingredients.',
  'Healthier Options: Less oil, no preservatives, and balanced nutrition.',
  'Affordable Pricing: Lower overhead means better prices for you.',
  'Local Connection: Support neighborhood chefs and build community.',
];

export const aboutValues = [
  'Quality & Hygiene: Every home chef is verified for kitchen hygiene, food handling practices, and quality standards.',
  'Supporting Communities: We empower homemakers to earn from their passion.',
  'Authentic Cooking: We celebrate the diversity of Indian home cooking.',
  'Customer Satisfaction: Your satisfaction is our priority.',
];

export const contactOptions = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Order Issue', value: 'order' },
  { label: 'Partner with Us (Home Chef)', value: 'partner' },
  { label: 'Business Inquiry', value: 'business' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Complaint', value: 'complaint' },
  { label: 'Other', value: 'other' },
];

export const contactDetails = [
  { title: 'Email', value: 'noreplay.gkk26@gmail.com', icon: '📧' },
  { title: 'Contact', value: '+91-9477564633', icon: '📞' },
  { title: 'Office Address', value: 'Unnamed Road, Gobindapur, Natunpara, Baruipur, West Bengal 700144, India', icon: '📍' },
  { title: 'Business Hours', value: 'Monday - Sunday: 9:00 AM - 9:00 PM IST', icon: '🕐' },
];

export const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Account Deletion', to: '/account-deletion' },
    ],
  },
];

export const policies = {
  privacy: {
    title: 'Privacy Policy',
    description: 'This policy explains how we collect, use, and protect your information.',
    sections: [
      { heading: 'Information We Collect', items: ['Personal: Name, Email, Phone, Delivery Address, Payment Info (processed by Razorpay).', 'Automatic: Device info, Location data (with permission), Usage data, Log data.', 'History: Order history and preferences.'] },
      { heading: 'How We Use Information', items: ['To provide services (process orders, deliver food).', 'To communicate (order updates, support).', 'To improve services (analytics, personalization).', 'For safety and legal compliance.'] },
      { heading: 'Information Sharing', items: ['Home Chefs: Name, address, phone shared for order fulfillment.', 'Delivery Partners: Name, address, phone shared for delivery.', 'Payment Processor: Razorpay handles payments securely.', 'Service Providers: Cloud hosting, analytics, marketing.', 'Legal: As required by law.'] },
      { heading: 'Data Security', items: ['Encryption, secure servers, and access controls.'] },
      { heading: 'Your Rights', items: ['Access, update, delete data.', 'Opt out of marketing.', 'Disable location permissions.'] },
      { heading: 'Cookies', items: ['Essential, analytics, and preference cookies used.'] },
      { heading: 'Third-Party Services', items: ['Razorpay, Google Analytics, Firebase.'] },
      { heading: "Children's Privacy", items: ['Not intended for under 18.'] },
      { heading: 'Data Retention', items: ['Retained as long as necessary for services/legal compliance.'] },
      { heading: 'Contact Us', items: ['Email: noreplay.gkk26@gmail.com', 'Phone: 8910894306'] },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'These terms explain how the platform works and what users can expect.',
    sections: [
      { heading: 'Acceptance', items: ['By using services, you agree to terms. Must be 18+.'] },
      { heading: 'Services', items: ['Marketplace connecting customers with independent home chefs. We are a tech platform, not a restaurant.'] },
      { heading: 'Accounts', items: ['You are responsible for account security. We can terminate accounts for violations.'] },
      { heading: 'Ordering & Payments', items: ['Orders are offers to purchase from chefs.', 'Payments handled by Razorpay.', 'Prices in INR. Delivery charges apply.'] },
      { heading: 'Cancellations', items: ['Customer: Full refund before cooking. Partial or no refund after cooking starts.', 'Chef: Full refund if chef cancels.'] },
      { heading: 'User Responsibilities', items: ['Accurate info, available for delivery, respectful behavior.'] },
      { heading: 'Prohibited', items: ['Fraud, harassment, illegal use, scraping.'] },
      { heading: 'Intellectual Property', items: ['Content owned by Ghar Ka Khana.'] },
      { heading: 'Liability', items: ['Chef responsible for food quality. Platform liability limited to order amount or INR 1,000.'] },
      { heading: 'Dispute Resolution', items: ['Governed by Indian laws. Jurisdiction: Mumbai.'] },
    ],
  },
  refund: {
    title: 'Refund Policy',
    description: 'Refund rules are designed to be simple and fair for customers and chefs.',
    sections: [
      { heading: 'Customer Cancellations', items: ['Full refund before cooking begins.', 'Partial or no refund after cooking starts.'] },
      { heading: 'Chef Cancellations', items: ['Full refund if the chef cancels an order.'] },
      { heading: 'Failed Payments', items: ['Failed or duplicate payments are handled according to the payment provider process.'] },
      { heading: 'Support', items: ['For any refund questions, contact support at noreplay.gkk26@gmail.com or 8910894306.'] },
    ],
  },
};
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Dog Food',
    category: 'Food',
    description: 'High-quality grain-free dog food for all breeds.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/8434633/pexels-photo-8434633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'Cat Scratching Post',
    category: 'Toy',
    description: 'Durable scratching post with feather toy for cats.',
    price: 19.99,
    image: 'https://images.pexels.com/photos/7725977/pexels-photo-7725977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    name: 'Pet Bed',
    category: 'Accessory',
    description: 'Cozy memory foam bed for dogs and cats.',
    price: 49.99,
    image: 'https://images.pexels.com/photos/26891652/pexels-photo-26891652/free-photo-of-domestic-cats-cozy-home-interior-yellow-furniture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    name: 'Interactive Dog Toy',
    category: 'Toy',
    description: 'Puzzle toy to keep your dog entertained for hours.',
    price: 14.99,
    image: 'https://images.pexels.com/photos/7789449/pexels-photo-7789449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function PetStore() {
  const colorScheme = useColorScheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Food' | 'Toy' | 'Accessory'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checking out.');
      return;
    }

    // Mock Stripe payment flow (replace with real integration)
    try {
      // Simulate API call to backend for payment intent
      console.log('Initiating payment for:', cart, 'Total:', calculateTotal());
      // Assume payment is successful for mock
      Alert.alert('Payment Successful', 'Thank you for your purchase!');
      setCart([]);
      setIsCartModalVisible(false);
    } catch (error) {
      Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
    }
  };

  const filteredProducts = mockProducts.filter(
    (product) =>
      (filter === 'All' || product.category === filter) &&
      (product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Pet Store
          </Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              handleButtonPress();
              setIsCartModalVisible(true);
            }}
          >
            <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
              <Ionicons name="cart" size={24} color={Colors[colorScheme ?? 'light'].iconColors['cart'] || Colors[colorScheme ?? 'light'].tint} />
              {cart.length > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.searchInput,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
            },
          ]}
          placeholder="Search by name or category..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={[
            styles.filterHeader,
            { backgroundColor: Colors[colorScheme ?? 'light'].card },
          ]}
          onPress={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Text style={[styles.filterHeaderText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filter by Category
          </Text>
          <Ionicons
            name={isFilterOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>

        {isFilterOpen && (
          <View style={styles.filterOptions}>
            {['All', 'Food', 'Toy', 'Accessory'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filter === category
                        ? Colors[colorScheme ?? 'light'].tint
                        : Colors[colorScheme ?? 'light'].card,
                  },
                ]}
                onPress={() => {
                  handleButtonPress();
                  setFilter(category as 'All' | 'Food' | 'Toy' | 'Accessory');
                }}
              >
                <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      {
                        color:
                          filter === category
                            ? '#fff'
                            : Colors[colorScheme ?? 'light'].text,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.productList}>
          {filteredProducts.length === 0 ? (
            <Text style={[styles.noResults, { color: Colors[colorScheme ?? 'light'].text }]}>
              No products found.
            </Text>
          ) : (
            filteredProducts.map((product) => (
              <View
                key={product.id}
                style={[
                  styles.productCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].card },
                ]}
              >
                {product.image ? (
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons
                      name="cart"
                      size={40}
                      color={Colors[colorScheme ?? 'light'].tabIconDefault}
                    />
                  </View>
                )}
                <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {product.name}
                </Text>
                <Text style={[styles.productCategory, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {product.category}
                </Text>
                <Text
                  style={[styles.productDescription, { color: Colors[colorScheme ?? 'light'].text }]}
                  numberOfLines={2}
                >
                  {product.description}
                </Text>
                <Text style={[styles.productPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addToCartButton,
                    { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['cart'] || Colors[colorScheme ?? 'light'].tint },
                  ]}
                  onPress={() => {
                    handleButtonPress();
                    addToCart(product);
                  }}
                >
                  <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <Modal
          visible={isCartModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCartModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Your Cart
                </Text>
                <TouchableOpacity
                  onPress={() => setIsCartModalVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                  />
                </TouchableOpacity>
              </View>
              {cart.length === 0 ? (
                <Text style={[styles.noResults, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Your cart is empty.
                </Text>
              ) : (
                <ScrollView style={styles.cartList}>
                  {cart.map((item) => (
                    <View
                      key={item.productId}
                      style={[
                        styles.cartItem,
                        { backgroundColor: Colors[colorScheme ?? 'light'].background },
                      ]}
                    >
                      <Text style={[styles.cartItemName, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.cartItemPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
                        ${item.price.toFixed(2)} x {item.quantity}
                      </Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.productId, -1)}
                        >
                          <Ionicons
                            name="remove"
                            size={20}
                            color={Colors[colorScheme ?? 'light'].tabIconDefault}
                          />
                        </TouchableOpacity>
                        <Text style={[styles.quantityText, { color: Colors[colorScheme ?? 'light'].text }]}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.productId, 1)}
                        >
                          <Ionicons
                            name="add"
                            size={20}
                            color={Colors[colorScheme ?? 'light'].tabIconDefault}
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.productId)}
                      >
                        <Ionicons
                          name="trash"
                          size={20}
                          color={Colors[colorScheme ?? 'light'].iconColors['paw'] || Colors[colorScheme ?? 'light'].tint}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              {cart.length > 0 && (
                <View style={styles.cartFooter}>
                  <Text style={[styles.totalText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Total: ${calculateTotal()}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.checkoutButton,
                      { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['cart'] || Colors[colorScheme ?? 'light'].tint },
                    ]}
                    onPress={() => {
                      handleButtonPress();
                      handleCheckout();
                    }}
                  >
                    <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                      <Ionicons name="card" size={20} color="#fff" />
                      <Text style={styles.checkoutButtonText}>Checkout</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productList: {
    flexDirection: 'column',
    gap: 16,
  },
  productCard: {
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 8,
    padding: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  cartItemPrice: {
    fontSize: 14,
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 4,
  },
  cartFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
});
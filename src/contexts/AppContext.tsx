import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem, User, CheckoutForm, Order, WishlistItem, UserActivity } from '../types';
import i18n from '../i18n'; // ✅ Adjust the path as needed

interface AppState {
  user: User | null;
  recentlyViewed: Product[];
  isAuthenticated: boolean;
  userInterests : string[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  currentCategory: string | null;
  // userInterests: string[];
  // Unifying user activity and interests here
  userActivity: {
    viewedProducts: Product[];
    searchQueries: string[];
    clickedCategories: string[];
    lastActivity: Date;
  };
  language: string;
  searchQuery: string;
  recentSearches?: string[];
  isVoiceSearchActive: boolean;
  isChatOpen: boolean;
  currentWeather: string;
  selectedCategory: string | null;
  orders: Order[];
  isLoading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  redirectPath: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGIN'; payload: User }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: Product }
  | { type: 'ADD_USER_INTEREST'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: User }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number; size?: string; color?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_VIEWED_PRODUCT'; payload: Product }
  | { type: 'ADD_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'ADD_CLICKED_CATEGORY'; payload: string }
  | { type: 'LOAD_USER_ACTIVITY'; payload: Partial<AppState['userActivity']> }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_VOICE_SEARCH' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_WEATHER'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'LOAD_CART_FROM_STORAGE'; payload: CartItem[] }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_REDIRECT_PATH'; payload: string | null };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  wishlist: [],
  currentCategory: null,
  userInterests: [],
  recentlyViewed: [],
  userActivity: {
    searchQueries: [],
    viewedProducts: [],
    clickedCategories: [],
    lastActivity: new Date()
  },
  language: 'en',
  searchQuery: '',
  recentSearches: [],
  isVoiceSearchActive: false,
  isChatOpen: false,
  currentWeather: 'sunny',
  selectedCategory: null,
  orders: [],
  isLoading: false,
  toast: null,
  redirectPath: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'LOGIN':
    case 'SIGNUP':
      localStorage.setItem('smartshop_user', JSON.stringify(action.payload));
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,
        toast: { 
          message: action.type === 'LOGIN' ? `Welcome back, ${action.payload.name}!` : `Welcome to SmartShop+, ${action.payload.name}!`, 
          type: 'success' 
        }
      };
    case 'SET_CATEGORY_FILTER':
      return {
      ...state,
      currentCategory: action.payload
    };

    case 'ADD_RECENTLY_VIEWED':
    return {
      ...state,
      recentlyViewed: [
      action.payload,
      ...state.recentlyViewed.filter(p => String(p.id) !== String(action.payload.id))
      ].slice(0, 10),
    };

    case 'ADD_USER_INTEREST':
      return {
      ...state,
      userInterests: [
        action.payload,
        ...state.userInterests.filter(interest => interest !== action.payload)
      ].slice(0, 10)
    };

    case 'LOGOUT':
      localStorage.removeItem('smartshop_user');
      localStorage.removeItem('smartshop_cart');
      localStorage.removeItem('smartshop_wishlist');
      return { 
        ...initialState, 
        language: state.language,
        toast: { message: 'Logged out successfully!', type: 'info' }
      };
    case 'ADD_TO_CART':
      const { product, quantity = 1, size, color } = action.payload;
      const existingItem = state.cart.find(item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );
      
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...state.cart, { 
          product, 
          quantity, 
          selectedSize: size, 
          selectedColor: color 
        }];
      }
      
      // Save to localStorage
      localStorage.setItem('smartshop_cart', JSON.stringify(newCart));
      return { 
        ...state, 
        cart: newCart,
        toast: { message: `${product.name} added to cart!`, type: 'success' }
      };

    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.product.id !== String(action.payload));
      localStorage.setItem('smartshop_cart', JSON.stringify(filteredCart));
      return { ...state, wishlist: state.wishlist.filter(item => item.product.id !== String(action.payload)), };

    case 'UPDATE_QUANTITY':
      const updatedCart = state.cart.map(item =>
        item.product.id === String(action.payload.productId)
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      localStorage.setItem('smartshop_cart', JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };

    case 'ADD_TO_WISHLIST':
      const existingWishlistItem = state.wishlist.find(item => item.product.id === action.payload.id);
      if (existingWishlistItem) return state;
      
      const newWishlist = [...state.wishlist, { product: action.payload, addedAt: new Date() }];
      localStorage.setItem('smartshop_wishlist', JSON.stringify(newWishlist));
      return { 
        ...state, 
        wishlist: newWishlist,
        toast: { message: `${action.payload.name} added to wishlist!`, type: 'success' }
      };

    case 'REMOVE_FROM_WISHLIST':
      const filteredWishlist = state.wishlist.filter(item => item.product.id !== String(action.payload));
      localStorage.setItem('smartshop_wishlist', JSON.stringify(filteredWishlist));
      return { ...state, wishlist: filteredWishlist };

    case 'ADD_VIEWED_PRODUCT':
      const viewedProducts = [action.payload, ...state.userActivity.viewedProducts.filter(p => p.id !== action.payload.id)].slice(0, 5);
      const updatedActivity = {
        ...state.userActivity,
        viewedProducts,
        lastActivity: new Date()
      };
      localStorage.setItem('smartshop_activity', JSON.stringify(updatedActivity));
      return { ...state, userActivity: updatedActivity };

    case 'ADD_SEARCH_QUERY':
      const searchQueries = [action.payload, ...state.userActivity.searchQueries.filter(q => q !== action.payload)].slice(0, 10);
      const searchActivity = {
        ...state.userActivity,
        searchQueries,
        lastActivity: new Date()
      };
      localStorage.setItem('smartshop_activity', JSON.stringify(searchActivity));
      return { ...state, userActivity: searchActivity };

    case 'ADD_CLICKED_CATEGORY':
      const clickedCategories = [action.payload, ...state.userActivity.clickedCategories.filter(c => c !== action.payload)].slice(0, 5);
      const categoryActivity = {
        ...state.userActivity,
        clickedCategories,
        lastActivity: new Date()
      };
      localStorage.setItem('smartshop_activity', JSON.stringify(categoryActivity));
      return { ...state, userActivity: categoryActivity };

    case 'LOAD_USER_ACTIVITY':
      return {
        ...state,
        userActivity: { ...state.userActivity, ...action.payload }
      };

    case 'SET_LANGUAGE':
      localStorage.setItem('smartshop_language', action.payload);
      return { ...state, language: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'ADD_RECENT_SEARCH':
      return {
        ...state,
        recentSearches: [
          ...new Set([action.payload, ...(state.recentSearches || [])]),
        ].slice(0, 10), // limit to 10
      };


    case 'TOGGLE_VOICE_SEARCH':
      return { ...state, isVoiceSearchActive: !state.isVoiceSearchActive };

    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };

    case 'SET_WEATHER':
      return { ...state, currentWeather: action.payload };

    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'CLEAR_CART':
      localStorage.removeItem('smartshop_cart');
      return { ...state, cart: [] };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'ADD_ORDER':
      const newOrders = [...state.orders, action.payload];
      localStorage.setItem('smartshop_orders', JSON.stringify(newOrders));
      return { ...state, orders: newOrders };

    case 'LOAD_CART_FROM_STORAGE':
      return { ...state, cart: action.payload };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
  i18n.changeLanguage(state.language);
  }, [state.language]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('smartshop_cart');
    const savedLanguage = localStorage.getItem('smartshop_language');
    const savedOrders = localStorage.getItem('smartshop_orders');
    const savedUser = localStorage.getItem('smartshop_user');
    const savedWishlist = localStorage.getItem('smartshop_wishlist');
    const savedActivity = localStorage.getItem('smartshop_activity');

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART_FROM_STORAGE', payload: cart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }

    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }

    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        // Assuming a 'SET_WISHLIST' action exists or should be added
        // For now, will skip dispatching to avoid breaking reducer
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }

    if (savedActivity) {
      try {
        const activity = JSON.parse(savedActivity);
        dispatch({ type: 'LOAD_USER_ACTIVITY', payload: activity });
      } catch (e) { console.error('Error loading activity from localStorage', e); }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
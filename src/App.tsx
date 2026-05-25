import { useState, createContext, useContext, useEffect } from 'react'
import Login from './components/Login'
import Home from './components/Home'

interface User {
  name: string
  email: string
  role?: 'user' | 'business'
  plan?: 'basic' | 'professional' | 'premium'
}

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  store: string
}

interface BusinessOffer {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  category: string
  storeName: string
  address: string
  lat: number
  lng: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  cartTotal: number
  totalSavings: number
  addSavings: (amount: number) => void
  businessOffers: BusinessOffer[]
  addBusinessOffer: (offer: Omit<BusinessOffer, 'id' | 'createdAt'>) => void
  removeBusinessOffer: (id: string) => void
  userOffersCount: number
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [businessOffers, setBusinessOffers] = useState<BusinessOffer[]>(() => {
    const saved = localStorage.getItem('niun5_business_offers')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('niun5_business_offers', JSON.stringify(businessOffers))
  }, [businessOffers])

  const login = (user: User) => setUser(user)
  const logout = () => {
    setUser(null)
    setCart([])
  }

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(x => x.id === item.id)
      if (existing) {
        return prev.map(x => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(x => x.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id)
    } else {
      setCart(prev => prev.map(x => x.id === id ? { ...x, quantity: qty } : x))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addSavings = (amount: number) => {
    setTotalSavings(prev => prev + amount)
  }

  const addBusinessOffer = (offer: Omit<BusinessOffer, 'id' | 'createdAt'>) => {
    const newOffer: BusinessOffer = {
      ...offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setBusinessOffers(prev => [...prev, newOffer])
  }

  const removeBusinessOffer = (id: string) => {
    setBusinessOffers(prev => prev.filter(x => x.id !== id))
  }

  const userOffersCount = businessOffers.length

  return (
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, totalSavings, addSavings, businessOffers, addBusinessOffer, removeBusinessOffer, userOffersCount }}>
      <div className="app">
        {user ? <Home /> : <Login />}
      </div>
    </AuthContext.Provider>
  )
}

export default App
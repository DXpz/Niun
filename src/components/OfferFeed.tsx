import { useState, useMemo } from 'react'
import { useAuth } from '../App'
import { calcDistance } from '../hooks/useUserLocation'
import './OfferFeed.css'

function calcDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return calcDistance(lat1, lon1, lat2, lon2)
}

interface Offer {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  category: string
  store: string
  address: string
  expiresAt: string
  verified: boolean
  lat: number
  lng: number
  discount: number
  rating: number
  soldCount: number
  isNew?: boolean
  isHot?: boolean
}

const sampleOffers: Offer[] = [
  // SUPERMERCADO
  { id: '1', title: 'Frijoles Rojos Premium 25lbs', description: 'Saco de frijoles rojos de primera calidad, importado de Mexico', originalPrice: 22.50, salePrice: 16.99, category: 'supermercado', store: 'Supermercado La Torre', address: 'Colonia Escalón, San Salvador', expiresAt: '2024-02-15', verified: true, lat: 13.6942, lng: -89.2202, discount: 24, rating: 4.8, soldCount: 234 },
  { id: '2', title: 'Arroz Importado Superior 5lbs', description: 'Arroz de grano largo importado de USA premium quality', originalPrice: 5.99, salePrice: 3.49, category: 'supermercado', store: 'Supermercado La Torre', address: 'Colonia Escalón, San Salvador', expiresAt: '2024-02-12', verified: true, lat: 13.6942, lng: -89.2202, discount: 42, rating: 4.6, soldCount: 892, isHot: true },
  { id: '3', title: 'Aceite de Oliva Extra Virg 1L', description: 'Aceite de oliva extra virgen importado de España Premium', originalPrice: 14.50, salePrice: 9.99, category: 'supermercado', store: 'Supermercado César', address: 'Colonia San Benito, San Salvador', expiresAt: '2024-02-10', verified: false, lat: 13.6967, lng: -89.2356, discount: 31, rating: 4.3, soldCount: 123 },
  { id: '4', title: 'Café Orgánico de Altura 500g', description: 'Café de altura tostado medio, granos enteros, origen Guatemala', originalPrice: 8.50, salePrice: 5.99, category: 'supermercado', store: 'Supermercado selecto', address: 'Colonia San Benito', expiresAt: '2024-02-08', verified: true, lat: 13.6970, lng: -89.2360, discount: 30, rating: 4.9, soldCount: 445 },
  { id: '5', title: 'Detergente Ariel Líquido 5L', description: 'Detergente Ariel líquido para ropa color, 5 litros concentrate', originalPrice: 12.99, salePrice: 8.49, category: 'supermercado', store: 'Supermercado César', address: 'Colonia San Benito', expiresAt: '2024-02-14', verified: true, lat: 13.6967, lng: -89.2356, discount: 35, rating: 4.5, soldCount: 334 },
  { id: '6', title: 'Azúcar Refinada Superior 5lbs', description: 'Azúcar refinada superior, saco de 5 libras empacada', originalPrice: 4.50, salePrice: 2.99, category: 'supermercado', store: 'Supermercado La Torre', address: 'Colonia Escalón', expiresAt: '2024-02-10', verified: true, lat: 13.6942, lng: -89.2202, discount: 34, rating: 4.4, soldCount: 1203 },
  { id: '7', title: 'Leche Evaporada Carnation 12pz', description: 'Pack de 12 latas de leche evaporada Carnation 390g cada una', originalPrice: 9.99, salePrice: 6.49, category: 'supermercado', store: 'Supermercado selecto', address: 'Colonia San Benito', expiresAt: '2024-02-20', verified: true, lat: 13.6970, lng: -89.2360, discount: 35, rating: 4.6, soldCount: 567 },
  { id: '8', title: 'Shampoo Head & Shoulders 750ml', description: 'Shampoo anticaspa Head & Shoulders Mentol Fresco 750ml', originalPrice: 8.99, salePrice: 5.99, category: 'supermercado', store: 'Supermercado César', address: 'Colonia San Benito', expiresAt: '2024-02-12', verified: true, lat: 13.6967, lng: -89.2356, discount: 33, rating: 4.5, soldCount: 445 },
  { id: '9', title: 'Pasta Dental Colgate 2-pack', description: 'Kit de pasta dental Colgate Total 2 unidades 150g cada una', originalPrice: 6.99, salePrice: 4.49, category: 'supermercado', store: 'Supermercado selecto', address: 'Colonia San Benito', expiresAt: '2024-02-18', verified: true, lat: 13.6970, lng: -89.2360, discount: 36, rating: 4.4, soldCount: 312 },
  { id: '10', title: 'Hojillas de Afeitear Gillette 8p', description: 'Pack de 8 hojillas Gillette Fusion5 para rasurar', originalPrice: 12.99, salePrice: 7.99, category: 'supermercado', store: 'Supermercado César', address: 'Colonia San Benito', expiresAt: '2024-02-15', verified: true, lat: 13.6967, lng: -89.2356, discount: 39, rating: 4.7, soldCount: 198 },

  // TECNOLOGÍA
  { id: '11', title: 'Smart TV 50" 4K Samsung Crystal UHD', description: 'Televisor Samsung 50 pulgadas 4K UHD Smart TV con WiFi y Bluetooth', originalPrice: 599.99, salePrice: 399.99, category: 'tecnologia', store: 'Almacenes Simán', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-20', verified: true, lat: 13.6924, lng: -89.2189, discount: 33, rating: 4.9, soldCount: 89, isHot: true },
  { id: '12', title: 'Laptop HP 15" Ryzen 5 8GB', description: 'Laptop HP 15-dw0000la Ryzen 5 8GB RAM 256GB SSD Windows 11', originalPrice: 549.99, salePrice: 449.99, category: 'tecnologia', store: 'Tech Zone SV', address: 'Calle La Reforma, San Salvador', expiresAt: '2024-02-25', verified: true, lat: 13.6920, lng: -89.2340, discount: 18, rating: 4.7, soldCount: 45 },
  { id: '13', title: 'iPhone 15 Pro 256GB Titanio', description: 'Apple iPhone 15 Pro 256GB Titanio Natural, nuevo sellado con garantía', originalPrice: 1099.99, salePrice: 899.99, category: 'tecnologia', store: 'iStore El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-03-01', verified: true, lat: 13.6930, lng: -89.2150, discount: 18, rating: 5.0, soldCount: 28, isNew: true },
  { id: '14', title: 'Audífonos Sony WH-1000XM5', description: 'Audífonos inalámbricos Noise Cancelling premium negro', originalPrice: 349.99, salePrice: 249.99, category: 'tecnologia', store: 'Tech Zone SV', address: 'Calle La Reforma', expiresAt: '2024-02-18', verified: true, lat: 13.6920, lng: -89.2340, discount: 29, rating: 4.8, soldCount: 67 },
  { id: '15', title: 'Tablet Samsung Galaxy Tab S9', description: 'Tablet Samsung 11" 128GB WiFi con S Pen incluido en caja', originalPrice: 799.99, salePrice: 599.99, category: 'tecnologia', store: 'Almacenes Simán', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-22', verified: true, lat: 13.6924, lng: -89.2189, discount: 25, rating: 4.6, soldCount: 41 },
  { id: '16', title: 'PlayStation 5 Digital Edition', description: 'Consola PS5 Digital Edition + Control DualSense incluido', originalPrice: 449.99, salePrice: 379.99, category: 'tecnologia', store: 'Game Zone SV', address: 'Centro Comercial Mega', expiresAt: '2024-03-05', verified: true, lat: 13.6900, lng: -89.2100, discount: 16, rating: 4.9, soldCount: 52, isHot: true },
  { id: '17', title: 'Teclado Mecánico RGB Logitech', description: 'Teclado gamer Logitech G915 TKL switches táctiles RGB', originalPrice: 199.99, salePrice: 129.99, category: 'tecnologia', store: 'Game Zone SV', address: 'Centro Comercial Mega', expiresAt: '2024-02-15', verified: true, lat: 13.6900, lng: -89.2100, discount: 35, rating: 4.8, soldCount: 34 },
  { id: '18', title: 'Mouse Gamer Logitech G502', description: 'Mouse gamer Logitech G502 HERO con sensor 25600 DPI', originalPrice: 79.99, salePrice: 49.99, category: 'tecnologia', store: 'Tech Zone SV', address: 'Calle La Reforma', expiresAt: '2024-02-16', verified: true, lat: 13.6920, lng: -89.2340, discount: 38, rating: 4.6, soldCount: 123 },
  { id: '19', title: 'Monitor LG 27" 4K UHD', description: 'Monitor LG 27UK850 27 pulgadas 4K UHD IPS HDR', originalPrice: 449.99, salePrice: 329.99, category: 'tecnologia', store: 'Almacenes Simán', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-24', verified: true, lat: 13.6924, lng: -89.2189, discount: 27, rating: 4.7, soldCount: 28 },
  { id: '20', title: 'Smartwatch Samsung Galaxy Watch 6', description: 'Reloj inteligente Samsung Galaxy Watch 6 44mm Bluetooth', originalPrice: 329.99, salePrice: 249.99, category: 'tecnologia', store: 'iStore El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-02-28', verified: true, lat: 13.6930, lng: -89.2150, discount: 24, rating: 4.5, soldCount: 56, isNew: true },

  // ÚTILES
  { id: '21', title: 'Cuadernos College Granel 10pz', description: 'Paquete de 10 cuadernos college espiral, diferentes colores', originalPrice: 12.00, salePrice: 7.99, category: 'utiles', store: 'Librería Yucatán', address: 'Boulevard del Hipódromo, San Salvador', expiresAt: '2024-02-28', verified: true, lat: 13.6955, lng: -89.2410, discount: 33, rating: 4.5, soldCount: 567 },
  { id: '22', title: 'Kit Útiles Escolares Completo', description: 'Kit completo: mochila, lápices, colores, regla, sacapuntas, cuadernos', originalPrice: 35.00, salePrice: 19.99, category: 'utiles', store: 'Librería Papelería', address: 'Colonia Floresta', expiresAt: '2024-02-28', verified: true, lat: 13.6980, lng: -89.2300, discount: 43, rating: 4.4, soldCount: 156 },
  { id: '23', title: 'Colores Prismacolor 12 Set', description: 'Set de colores profesionales Prismacolor 12 unidades en estuche', originalPrice: 24.99, salePrice: 14.99, category: 'utiles', store: 'Librería Yucatán', address: 'Boulevard del Hipódromo', expiresAt: '2024-02-25', verified: true, lat: 13.6955, lng: -89.2410, discount: 40, rating: 4.7, soldCount: 203 },
  { id: '24', title: 'Mochila Ergonomica Teen Premium', description: 'Mochila con puertos USB integrados, resistente al agua', originalPrice: 28.00, salePrice: 15.99, category: 'utiles', store: 'Librería Papelería', address: 'Colonia Floresta', expiresAt: '2024-02-27', verified: false, lat: 13.6980, lng: -89.2300, discount: 43, rating: 4.2, soldCount: 89, isNew: true },
  { id: '25', title: 'Borradores Colores Pack 6pz', description: 'Set de borradores de colores para pizarrón blanco 6 unidades', originalPrice: 4.50, salePrice: 2.49, category: 'utiles', store: 'Librería Papelería', address: 'Colonia Floresta', expiresAt: '2024-02-28', verified: true, lat: 13.6980, lng: -89.2300, discount: 45, rating: 4.3, soldCount: 234 },
  { id: '26', title: 'Lápices Faber-Castell 24 colores', description: 'Set de 24 lápices de colores Faber-Castell hexagonal', originalPrice: 15.99, salePrice: 9.99, category: 'utiles', store: 'Librería Yucatán', address: 'Boulevard del Hipódromo', expiresAt: '2024-02-26', verified: true, lat: 13.6955, lng: -89.2410, discount: 38, rating: 4.8, soldCount: 445 },
  { id: '27', title: 'Tajador Crayola 24 tons', description: 'Set de 24 tajadores Crayola con soporte y depósitos', originalPrice: 18.99, salePrice: 11.99, category: 'utiles', store: 'Librería Papelería', address: 'Colonia Floresta', expiresAt: '2024-02-24', verified: true, lat: 13.6980, lng: -89.2300, discount: 37, rating: 4.6, soldCount: 167 },
  { id: '28', title: 'Regla 30cm Transparente 2pk', description: 'Pack de 2 reglas 30cm de plástico transparente', originalPrice: 3.99, salePrice: 1.99, category: 'utiles', store: 'Librería Yucatán', address: 'Boulevard del Hipódromo', expiresAt: '2024-02-20', verified: true, lat: 13.6955, lng: -89.2410, discount: 50, rating: 4.2, soldCount: 523 },

  // FARMACIA
  { id: '29', title: 'Vitamina C 1000mg 30 tabs', description: 'Suplemento de Vitamina C 1000mg effervescentes 30 tabletas', originalPrice: 12.99, salePrice: 7.99, category: 'farmacia', store: 'Farmacia San Andrés', address: 'Colonia San Rafael', expiresAt: '2024-02-20', verified: true, lat: 13.6950, lng: -89.2250, discount: 38, rating: 4.6, soldCount: 234, isHot: true },
  { id: '30', title: 'Acetaminofén 500mg 100tabs', description: 'Analgésico Acetaminofén 500mg presentación 100 tabletas', originalPrice: 8.99, salePrice: 5.49, category: 'farmacia', store: 'Farmacia del Pueblo', address: 'Centro Histórico', expiresAt: '2024-02-18', verified: true, lat: 13.6870, lng: -89.2060, discount: 39, rating: 4.5, soldCount: 567 },
  { id: '31', title: 'Protector Solar Nivea SPF 50 200ml', description: 'Bloqueador solar Nivea Sun SPF 50 protección 4 horas', originalPrice: 15.99, salePrice: 10.99, category: 'farmacia', store: 'Farmacia San Andrés', address: 'Colonia San Rafael', expiresAt: '2024-02-25', verified: true, lat: 13.6950, lng: -89.2250, discount: 31, rating: 4.7, soldCount: 189 },
  { id: '32', title: 'Desodorante Rexona Woman 75g', description: 'Desodorante Rexona Clinical Protection para mujer 75g', originalPrice: 6.99, salePrice: 4.49, category: 'farmacia', store: 'Farmacia del Pueblo', address: 'Centro Histórico', expiresAt: '2024-02-22', verified: true, lat: 13.6870, lng: -89.2060, discount: 36, rating: 4.4, soldCount: 312 },
  { id: '33', title: 'Alcohol Antiséptico 500ml', description: 'Alcohol etílico 70% para desinfección 500ml', originalPrice: 4.99, salePrice: 2.99, category: 'farmacia', store: 'Farmacia San Andrés', address: 'Colonia San Rafael', expiresAt: '2024-02-15', verified: true, lat: 13.6950, lng: -89.2250, discount: 40, rating: 4.3, soldCount: 789 },
  { id: '34', title: 'Sales de Rehidratación 10sobres', description: 'Suero oral sales de rehidratación oral UNICEF 10 sobres', originalPrice: 5.99, salePrice: 3.49, category: 'farmacia', store: 'Farmacia del Pueblo', address: 'Centro Histórico', expiresAt: '2024-02-12', verified: true, lat: 13.6870, lng: -89.2060, discount: 42, rating: 4.8, soldCount: 445 },

  // HOGAR
  { id: '35', title: 'Sábanas Matrimonial 200hilos', description: 'Juego de sábanas matrimonial 200 hilos 100% algodón', originalPrice: 45.99, salePrice: 29.99, category: 'hogar', store: 'HogarExpress', address: 'Centro Comercial El Ángel', expiresAt: '2024-02-28', verified: true, lat: 13.6940, lng: -89.2200, discount: 35, rating: 4.5, soldCount: 87 },
  { id: '36', title: 'Set de Ollas 5 piezas Tramontina', description: 'Juego de ollas Tramontina acero inoxidable 5 piezas', originalPrice: 89.99, salePrice: 59.99, category: 'hogar', store: 'HogarExpress', address: 'Centro Comercial El Ángel', expiresAt: '2024-02-25', verified: true, lat: 13.6940, lng: -89.2200, discount: 33, rating: 4.7, soldCount: 45, isHot: true },
  { id: '37', title: 'Taladro Eléctrico Black+Decker', description: 'Taladro inalámbrico 20V MAX con kit de brocas', originalPrice: 129.99, salePrice: 89.99, category: 'hogar', store: 'Ferretería La Central', address: 'Boulevard del Estadio', expiresAt: '2024-02-20', verified: true, lat: 13.6880, lng: -89.2150, discount: 31, rating: 4.4, soldCount: 67 },
  { id: '38', title: 'Juego de Cuchillos 6 piezas', description: 'Set de 6 cuchillos de cocina con bloque de madera', originalPrice: 34.99, salePrice: 19.99, category: 'hogar', store: 'HogarExpress', address: 'Centro Comercial El Ángel', expiresAt: '2024-02-22', verified: true, lat: 13.6940, lng: -89.2200, discount: 43, rating: 4.6, soldCount: 123 },
  { id: '39', title: 'Lámpara LED Escritorio USB', description: 'Lámpara de escritorio LED táctil recargable USB', originalPrice: 24.99, salePrice: 14.99, category: 'hogar', store: 'Ferretería La Central', address: 'Boulevard del Estadio', expiresAt: '2024-02-18', verified: true, lat: 13.6880, lng: -89.2150, discount: 40, rating: 4.3, soldCount: 234, isNew: true },
  { id: '40', title: 'Cortinas Blackout 2 paneles', description: 'Pares de cortinas black-out 240x200cm 2 paneles', originalPrice: 39.99, salePrice: 24.99, category: 'hogar', store: 'HogarExpress', address: 'Centro Comercial El Ángel', expiresAt: '2024-02-26', verified: true, lat: 13.6940, lng: -89.2200, discount: 38, rating: 4.5, soldCount: 78 },

  // ROPA
  { id: '41', title: 'Zapatillas Nike Air Max 90', description: 'Tennis Nike Air Max 90 running casual hombre', originalPrice: 149.99, salePrice: 99.99, category: 'ropa', store: 'Bata El Salvador', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-20', verified: true, lat: 13.6924, lng: -89.2189, discount: 33, rating: 4.8, soldCount: 67, isHot: true },
  { id: '42', title: 'Camisa Ralph Lauren Manga Larga', description: 'Camisa formal Ralph Lauren manga larga hombre', originalPrice: 89.99, salePrice: 59.99, category: 'ropa', store: 'Bata El Salvador', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-22', verified: true, lat: 13.6924, lng: -89.2189, discount: 33, rating: 4.7, soldCount: 34 },
  { id: '43', title: 'Jeans Levis 501 Original Fit', description: 'Pantalon Levis 501 Original Fit hombre', originalPrice: 79.99, salePrice: 49.99, category: 'ropa', store: 'Bata El Salvador', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-18', verified: true, lat: 13.6924, lng: -89.2189, discount: 38, rating: 4.6, soldCount: 89 },
  { id: '44', title: 'Vestido Mango Talla S-M-L', description: 'Vestido casual Mango para mujer verano 2024', originalPrice: 59.99, salePrice: 35.99, category: 'ropa', store: 'Fashion SV', address: 'Colonia Escalón', expiresAt: '2024-02-25', verified: true, lat: 13.6942, lng: -89.2202, discount: 40, rating: 4.4, soldCount: 56 },
  { id: '45', title: 'Chaqueta Corta-vientos Adidas', description: 'Chaqueta adidas cortavientos para hombre', originalPrice: 99.99, salePrice: 69.99, category: 'ropa', store: 'Bata El Salvador', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-28', verified: true, lat: 13.6924, lng: -89.2189, discount: 30, rating: 4.5, soldCount: 45, isNew: true },
  { id: '46', title: 'Calcetines Deportivos 6 pares', description: 'Pack de 6 pares calcetines deportivos Puma', originalPrice: 19.99, salePrice: 11.99, category: 'ropa', store: 'Fashion SV', address: 'Colonia Escalón', expiresAt: '2024-02-15', verified: true, lat: 13.6942, lng: -89.2202, discount: 40, rating: 4.3, soldCount: 234 },

  // DEPORTES
  { id: '47', title: 'Pelota Adidas Champions League', description: 'Balón oficial Adidas Champions League 2024', originalPrice: 89.99, salePrice: 59.99, category: 'deportes', store: 'Sports World SV', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-20', verified: true, lat: 13.6924, lng: -89.2189, discount: 33, rating: 4.9, soldCount: 156 },
  { id: '48', title: 'Mancuernas 20kg Set', description: 'Set de mancuernas ajustables 20kg con barra', originalPrice: 149.99, salePrice: 99.99, category: 'deportes', store: 'Gimnasio Iron Fitness', address: 'Colonia La Mascota', expiresAt: '2024-02-25', verified: true, lat: 13.6970, lng: -89.2300, discount: 33, rating: 4.6, soldCount: 78, isHot: true },
  { id: '49', title: 'Bicicleta Mountain Bike 26"', description: 'Bicicleta MTB 26 pulgadas aluminio Shimano 21v', originalPrice: 349.99, salePrice: 249.99, category: 'deportes', store: 'Bikes El Salvador', address: 'Boulevard del Estadio', expiresAt: '2024-02-28', verified: true, lat: 13.6880, lng: -89.2150, discount: 29, rating: 4.7, soldCount: 23 },
  { id: '50', title: 'Raqueta Tenis Wilson Pro 300', description: 'Raqueta de tenis Wilson Pro Staff 300', originalPrice: 129.99, salePrice: 89.99, category: 'deportes', store: 'Sports World SV', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-22', verified: true, lat: 13.6924, lng: -89.2189, discount: 31, rating: 4.8, soldCount: 45 },
  { id: '51', title: 'Colchoneta Yoga 6mm Premium', description: 'Mat de yoga 6mm antideslizante con bolsa', originalPrice: 29.99, salePrice: 17.99, category: 'deportes', store: 'Gimnasio Iron Fitness', address: 'Colonia La Mascota', expiresAt: '2024-02-18', verified: true, lat: 13.6970, lng: -89.2300, discount: 40, rating: 4.5, soldCount: 134 },
  { id: '52', title: 'Globo FIFA World Cup 2022', description: 'Balón oficial FIFA World Cup Qatar 2022', originalPrice: 34.99, salePrice: 19.99, category: 'deportes', store: 'Sports World SV', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-15', verified: true, lat: 13.6924, lng: -89.2189, discount: 43, rating: 4.9, soldCount: 267, isNew: true },

  // RESTAURANTES
  { id: '53', title: 'Combo Hamburguesa + Papa + Refresco', description: 'Hamburguesa clásica + papas fritas + bebida 500ml', originalPrice: 8.99, salePrice: 5.99, category: 'restaurantes', store: 'Burger King SV', address: 'Centro Comercial Metro Centro', expiresAt: '2024-02-15', verified: true, lat: 13.6924, lng: -89.2189, discount: 33, rating: 4.5, soldCount: 567 },
  { id: '54', title: 'Pizza Mediana 2 Ingredientes', description: 'Pizza mediana 2 ingredientes a elegir + bordes queso', originalPrice: 12.99, salePrice: 7.99, category: 'restaurantes', store: 'Pizza Hut El Salvador', address: 'Colonia Escalón', expiresAt: '2024-02-20', verified: true, lat: 13.6942, lng: -89.2202, discount: 38, rating: 4.6, soldCount: 789, isHot: true },
  { id: '55', title: 'Almuerzo Ejecutivo Completo', description: 'Almuerzo ejecutivo: carne + sopa + ensalada + bebida', originalPrice: 9.99, salePrice: 6.49, category: 'restaurantes', store: 'Pollo Campero', address: 'Centro Comercial El Ángel', expiresAt: '2024-02-18', verified: true, lat: 13.6940, lng: -89.2200, discount: 35, rating: 4.7, soldCount: 890 },
  { id: '56', title: 'Cupcake Decorado 6pz', description: 'Pack de 6 cupcakes decorados a elegir, birthday pack', originalPrice: 15.99, salePrice: 9.99, category: 'restaurantes', store: 'Cupcakes Factory', address: 'Colonia San Benito', expiresAt: '2024-02-25', verified: true, lat: 13.6967, lng: -89.2356, discount: 38, rating: 4.8, soldCount: 234, isNew: true },
  { id: '57', title: 'Café Americano + Pan dulce', description: 'Café americano grande + croissant de mantequilla', originalPrice: 5.99, salePrice: 3.49, category: 'restaurantes', store: 'Starbucks El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-02-22', verified: true, lat: 13.6930, lng: -89.2150, discount: 42, rating: 4.6, soldCount: 1234 },
  { id: '58', title: 'Tacos al Pastor 4pz', description: '4 tacos al pastor con cilantro, cebolla y salsa', originalPrice: 7.99, salePrice: 4.99, category: 'restaurantes', store: 'Taquería El Rey', address: 'Centro Histórico', expiresAt: '2024-02-16', verified: true, lat: 13.6870, lng: -89.2060, discount: 38, rating: 4.9, soldCount: 456 },

  // BELLEZA
  { id: '59', title: 'Base Lancôme Teint Idole 30ml', description: 'Base de maquillaje Lancôme Teint Idole SPF 15', originalPrice: 44.99, salePrice: 29.99, category: 'belleza', store: 'Sephora El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-02-20', verified: true, lat: 13.6930, lng: -89.2150, discount: 33, rating: 4.7, soldCount: 78 },
  { id: '60', title: 'Labial MAC Ruby Woo', description: 'Labial MAC Amplified Creme Ruby Woo', originalPrice: 24.99, salePrice: 15.99, category: 'belleza', store: 'Sephora El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-02-22', verified: true, lat: 13.6930, lng: -89.2150, discount: 36, rating: 4.9, soldCount: 156 },
  { id: '61', title: 'Crema Nivea 48h Hidratación', description: 'Hidratante corporal Nivea 48h protección 400ml', originalPrice: 12.99, salePrice: 7.99, category: 'belleza', store: 'Perfumería xyz', address: 'Colonia Escalón', expiresAt: '2024-02-25', verified: true, lat: 13.6942, lng: -89.2202, discount: 38, rating: 4.5, soldCount: 289 },
  { id: '62', title: 'Perfume Chanel Chance 50ml', description: 'Perfume Chanel Chance EDP spray 50ml', originalPrice: 129.99, salePrice: 89.99, category: 'belleza', store: 'Perfumería xyz', address: 'Colonia Escalón', expiresAt: '2024-02-28', verified: true, lat: 13.6942, lng: -89.2202, discount: 31, rating: 4.8, soldCount: 45, isHot: true },
  { id: '63', title: 'Kit Brochas Maquillaje 12pz', description: 'Set de 12 brochas de maquillaje profesional', originalPrice: 34.99, salePrice: 19.99, category: 'belleza', store: 'Sephora El Salvador', address: 'Centro Comercial Parque神', expiresAt: '2024-02-18', verified: true, lat: 13.6930, lng: -89.2150, discount: 43, rating: 4.6, soldCount: 134 },
  { id: '64', title: 'Mascarilla Capilar Kerastase 250ml', description: 'Tratamiento capilar Kerastase Discipline 250ml', originalPrice: 39.99, salePrice: 24.99, category: 'belleza', store: 'Perfumería xyz', address: 'Colonia Escalón', expiresAt: '2024-02-15', verified: true, lat: 13.6942, lng: -89.2202, discount: 38, rating: 4.7, soldCount: 98 }
]

interface Props {
  category: string
  userLat?: number
  userLng?: number
  sortByProximity?: boolean
  onShowOnMap?: (offer: { storeName: string; offerTitle: string; lat: number; lng: number; address: string }) => void
}

function OfferFeed({ category, userLat, userLng, sortByProximity = false, onShowOnMap }: Props) {
  const { addToCart, addSavings } = useAuth()
  const [saved, setSaved] = useState<string[]>([])
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'relevance' | 'discount' | 'price-low' | 'price-high' | 'proximity'>('relevance')

  const filteredOffers = useMemo(() => {
    let offers = sampleOffers.filter(offer => {
      return category === 'all' || offer.category === category
    })

    switch(sortBy) {
      case 'discount':
        offers = [...offers].sort((a, b) => b.discount - a.discount)
        break
      case 'price-low':
        offers = [...offers].sort((a, b) => a.salePrice - b.salePrice)
        break
      case 'price-high':
        offers = [...offers].sort((a, b) => b.salePrice - a.salePrice)
        break
      case 'proximity':
        if (userLat && userLng) {
          offers = [...offers].sort((a, b) => {
            const distA = calcDist(userLat, userLng, a.lat, a.lng)
            const distB = calcDist(userLat, userLng, b.lat, b.lng)
            return distA - distB
          })
        }
        break
    }

    return offers
  }, [category, sortBy, userLat, userLng])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const toggleSave = (id: string) => {
    setSaved(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleAddToCart = (offer: Offer) => {
    setAnimatingId(offer.id)
    const savings = offer.originalPrice - offer.salePrice
    addSavings(savings)
    addToCart({ id: offer.id, title: offer.title, price: offer.salePrice, store: offer.store })
    setAddedId(offer.id)
    setTimeout(() => {
      setAnimatingId(null)
      setAddedId(null)
    }, 2000)
  }

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'supermercado': return '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>'
      case 'tecnologia': return '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>'
      case 'utiles': return '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>'
      case 'farmacia': return '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>'
      case 'hogar': return '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>'
      case 'ropa': return '<path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>'
      case 'deportes': return '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/>'
      case 'restaurantes': return '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>'
      case 'belleza': return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
      default: return ''
    }
  }

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'supermercado': return { bg: 'rgba(72, 199, 116, 0.1)', color: '#48c774', border: 'rgba(72, 199, 116, 0.2)' }
      case 'tecnologia': return { bg: 'rgba(86, 140, 248, 0.1)', color: '#568cf8', border: 'rgba(86, 140, 248, 0.2)' }
      case 'utiles': return { bg: 'rgba(253, 184, 72, 0.1)', color: '#fdb848', border: 'rgba(253, 184, 72, 0.2)' }
      case 'farmacia': return { bg: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', border: 'rgba(255, 107, 107, 0.2)' }
      case 'hogar': return { bg: 'rgba(160, 100, 220, 0.1)', color: '#a064dc', border: 'rgba(160, 100, 220, 0.2)' }
      case 'ropa': return { bg: 'rgba(255, 127, 80, 0.1)', color: '#ff7f50', border: 'rgba(255, 127, 80, 0.2)' }
      case 'deportes': return { bg: 'rgba(0, 200, 200, 0.1)', color: '#00c8c8', border: 'rgba(0, 200, 200, 0.2)' }
      case 'restaurantes': return { bg: 'rgba(255, 99, 71, 0.1)', color: '#ff6347', border: 'rgba(255, 99, 71, 0.2)' }
      case 'belleza': return { bg: 'rgba(255, 182, 193, 0.1)', color: '#ffb6c1', border: 'rgba(255, 182, 193, 0.2)' }
      default: return { bg: 'rgba(255, 255, 255, 0.05)', color: '#888', border: 'rgba(255, 255, 255, 0.1)' }
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg key={i} viewBox="0 0 24 24" width="12" height="12"
          fill={i <= Math.round(rating) ? '#FFD322' : 'none'}
          stroke={i <= Math.round(rating) ? '#FFD322' : '#444'}
          strokeWidth="2">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
        </svg>
      )
    }
    return stars
  }

  return (
    <div className="offer-feed">
      <div className="feed-controls">
        <div className="results-count">
          {filteredOffers.length} ofertas encontradas
        </div>
        <div className="sort-control">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="relevance">Relevancia</option>
            <option value="discount">Mayor descuento</option>
            <option value="price-low">Menor precio</option>
            <option value="price-high">Mayor precio</option>
            {sortByProximity && userLat && <option value="proximity">Cercanía</option>}
          </select>
        </div>
      </div>

      <div className="offers-grid">
        {filteredOffers.map(offer => {
          const catStyle = getCategoryColor(offer.category)
          return (
            <article key={offer.id} className={`offer-card ${animatingId === offer.id ? 'adding' : ''}`}>
              <div className="card-header">
                <span className="category-badge" style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: getCategoryIcon(offer.category) }} />
                  <span>{offer.category}</span>
                </span>
                <div className="card-badges">
                  {offer.isNew && <span className="badge new">Nuevo</span>}
                  {offer.isHot && <span className="badge hot">Hot</span>}
                </div>
              </div>

              <div className="discount-badge">
                -{offer.discount}%
              </div>

              <div className="offer-rating">
                {renderStars(offer.rating)}
                <span className="rating-text">{offer.rating}</span>
                <span className="sold-count">({offer.soldCount})</span>
              </div>

              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>

              <div className="offer-pricing">
                <span className="original-price">{formatPrice(offer.originalPrice)}</span>
                <span className="sale-price">{formatPrice(offer.salePrice)}</span>
              </div>

              <div className="offer-store">
                <p className="store-name">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  {offer.store}
                </p>
                <p className="store-address">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {offer.address}
                </p>
              </div>

              <div className="card-footer">
                <div className="expiry">
                  {offer.verified ? (
                    <span className="verified">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      Verificada
                    </span>
                  ) : (
                    <span className="unverified">Sin verificar</span>
                  )}
                </div>
                <button className="show-on-map-btn" onClick={() => onShowOnMap?.({ storeName: offer.store, offerTitle: offer.title, lat: offer.lat, lng: offer.lng, address: offer.address })}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/>
                    <line x1="8" y1="2" x2="8" y2="18"/>
                    <line x1="16" y1="6" x2="16" y2="22"/>
                  </svg>
                  Ver mapa
                </button>
                <button
                  className={`add-to-cart-btn ${addedId === offer.id ? 'added' : ''}`}
                  onClick={() => handleAddToCart(offer)}
                >
                  {addedId === offer.id ? (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Agregado
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                      </svg>
                      Agregar
                    </>
                  )}
                </button>
              </div>

              <div className="card-actions-overlay">
                <button className={`action-overlay-btn ${saved.includes(offer.id) ? 'saved' : ''}`} onClick={() => toggleSave(offer.id)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill={saved.includes(offer.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
                <button className="action-overlay-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No hay ofertas disponibles en esta categoría</p>
        </div>
      )}
    </div>
  )
}

export default OfferFeed
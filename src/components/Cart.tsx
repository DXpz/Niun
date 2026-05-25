import { useState } from 'react'
import { useAuth } from '../App'
import './Cart.css'

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
        </div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega ofertas para verlas aquí</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <span className="item-count">{cart.length} productos</span>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h4>{item.title}</h4>
              <p>{item.store}</p>
            </div>
            <div className="item-price">{formatPrice(item.price)}</div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-subtotal">{formatPrice(item.price * item.quantity)}</div>
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span className="free-shipping">Gratis</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        Proceder al Pago
      </button>

      {showCheckout && <CheckoutModal onClose={() => { setShowCheckout(false); clearCart(); }} />}
    </div>
  )
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { cart, cartTotal } = useAuth()
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handlePayment = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2000))
    setProcessing(false)
    setOrderComplete(true)
  }

  if (orderComplete) {
    return (
      <div className="modal-overlay">
        <div className="modal checkout-modal">
          <div className="success-animation">
            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#48c774" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 12l2.5 2.5L16 9"/>
            </svg>
          </div>
          <h2>¡Pago Exitoso!</h2>
          <p>Tu pedido ha sido procesando correctamente.</p>
          <div className="order-number">
            <span>Número de orden:</span>
            <strong>#{Math.random().toString(36).substring(2, 10).toUpperCase()}</strong>
          </div>
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {step === 1 && (
          <div className="checkout-step">
            <h3>Información de Envío</h3>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" placeholder="Tu nombre" defaultValue="Carlos Mendoza" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="+503 0000 0000" defaultValue="+503 2222 3333" />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="tel" placeholder="+503 0000 0000" defaultValue="+503 7777 8888" />
              </div>
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input type="text" placeholder="Colonia, calle, número" defaultValue="Colonia Escalón, San Salvador" />
            </div>
            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea placeholder="Indicaciones para la entrega..." rows={3} defaultValue="Llamar antes de entregar" />
            </div>
            <button className="btn-primary" onClick={() => setStep(2)}>Continuar</button>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-step">
            <h3>Método de Pago</h3>
            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div className="method-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <strong>Tarjeta</strong>
                  <span>Visa, MC, AMEX</span>
                </div>
                <div className="card-logos">
                  <span className="card-badge visa">VISA</span>
                  <span className="card-badge mc">MC</span>
                  <span className="card-badge amex">AMEX</span>
                </div>
              </label>
              <label className={`payment-method ${paymentMethod === 'wompi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'wompi'}
                  onChange={() => setPaymentMethod('wompi')}
                />
                <div className="method-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#48c774" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                  <strong>Wompi</strong>
                  <span>Banco Agrícola</span>
                </div>
              </label>
              <label className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
                <div className="method-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  <strong>Efectivo</strong>
                  <span>Contra entrega</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label>Número de tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" defaultValue="4532 1234 5678 9012" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de expiración</label>
                    <input type="text" placeholder="MM/YY" defaultValue="12/26" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" defaultValue="456" />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'wompi' && (
              <div className="form-group">
                <label>Número de documento</label>
                <input type="text" placeholder=" DUI o NIT" />
              </div>
            )}

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Revisar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-step">
            <h3>Revisar Pedido</h3>
            <div className="order-summary">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.title} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="summary-divider" />
              <div className="summary-item">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-item">
                <span>Envío</span>
                <span className="free">Gratis</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>Atrás</button>
              <button className="btn-primary" onClick={handlePayment} disabled={processing}>
                {processing ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Pagar {formatPrice(cartTotal)}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
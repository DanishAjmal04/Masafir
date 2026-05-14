import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { selectCartCount } from '../store/cartSlice.js'

const MOBILE_BP = 768

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [navHovered, setNavHovered] = useState(false)
  const [isMobile,   setIsMobile]   = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BP : false
  )

  const cartCount = useSelector(selectCartCount)
  const location  = useLocation()
  const isHome    = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [menuOpen])

  const useDarkBar = navHovered || scrolled || !isHome
  const textCol    = '#faf9f6'
  const navBg      = useDarkBar ? '#1a1a1a' : 'transparent'
  const navBorder  = useDarkBar ? '1px solid rgba(250,249,246,0.12)' : '1px solid transparent'

  const navHeight    = isMobile ? 56  : 64
  const logoSize     = isMobile ? 18  : 22
  const logoTracking = isMobile ? '0.2em' : '0.25em'
  const iconSize     = isMobile ? 18  : 16
  const menuIconSize = isMobile ? 22  : 20
  const rightGap     = isMobile ? 12  : 24

  return (
    <nav
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        zIndex:          50,
        transition:      'background-color 0.35s ease, border-color 0.35s ease',
        backgroundColor: navBg,
        borderBottom:    navBorder,
        overflowX:       'hidden',
        boxSizing:       'border-box',
        fontFamily:      "'Figtree', sans-serif"
      }}
    >
      <div style={{
        width:     '100%',
        maxWidth:  '1400px',
        margin:    '0 auto',
        padding:   isMobile ? '0 16px' : '0 48px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems:          'center',
          height:              `${navHeight}px`,
          minHeight:           `${navHeight}px`,
          width:               '100%',
        }}>

          {/* Hamburger */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background:     'none',
                border:         'none',
                cursor:         'pointer',
                color:          textCol,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                padding:        '0',
                minWidth:       44,
                minHeight:      44,
              }}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={menuIconSize} /> : <Menu size={menuIconSize} />}
            </button>
          </div>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', justifySelf: 'center' }}>
            <span
              className="font-display"
              style={{
                fontSize:      `${logoSize}px`,
                fontWeight:    300,
                letterSpacing: logoTracking,
                textTransform: 'uppercase',
                color:         textCol,
                transition:    'color 0.3s',
                whiteSpace:    'nowrap',
                fontFamily:    "'Figtree', sans-serif"
              }}
            >
              Masafir
            </span>
          </Link>

          {/* Right icons */}
          <div style={{
            display:        'flex',
            justifyContent: 'flex-end',
            alignItems:     'center',
            gap:            `${rightGap}px`,
          }}>
            <Link
              to="/cart"
              style={{
                position:       'relative',
                color:          textCol,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                textDecoration: 'none',
                minWidth:       44,
                minHeight:      44,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              aria-label="Cart"
            >
              <ShoppingBag size={iconSize} />
              {cartCount > 0 && (
                <span style={{
                  position:        'absolute',
                  top:             isMobile ? 6 : 4,
                  right:           isMobile ? 6 : 4,
                  minWidth:        '16px',
                  height:          '16px',
                  padding:         '0 4px',
                  backgroundColor: '#b89870',
                  color:           '#faf9f6',
                  fontSize:        '9px',
                  borderRadius:    '50%',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  fontWeight:      300,
                  lineHeight:      1,
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          <div style={{
            backgroundColor: useDarkBar ? '#1a1a1a' : 'rgba(26,26,26,0.97)',
            borderTop:       '1px solid rgba(250,249,246,0.12)',
            width:           '100%',
            boxSizing:       'border-box',
            padding:         isMobile ? '24px 16px 32px' : '32px 48px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Shop',    to: '/shop'    },
                { label: 'Account', to: '/account' },
                { label: 'Cart',    to: '/cart'    },
              ].map(({ label, to }, i, arr) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize:       isMobile ? 14 : 13,
                    letterSpacing:  '0.15em',
                    textTransform:  'uppercase',
                    fontWeight:     300,
                    color:          '#faf9f6',
                    textDecoration: 'none',
                    padding:        '14px 0',
                    borderBottom:   i < arr.length - 1
                      ? '1px solid rgba(250,249,246,0.08)'
                      : 'none',
                    display:        'block',
                    fontFamily:    "'Figtree', sans-serif"
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{
              position:   'fixed',
              inset:      0,
              zIndex:     -1,
              border:     'none',
              background: 'rgba(0,0,0,0.35)',
              cursor:     'pointer',
            }}
          />
        </>
      )}
    </nav>
  )
}
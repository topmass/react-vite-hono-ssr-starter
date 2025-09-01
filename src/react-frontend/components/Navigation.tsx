import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ 
      marginBottom: '2rem',
      padding: '1rem',
      borderBottom: '1px solid #333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: '#646cff',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 500
          }}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          style={{ 
            color: '#646cff',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 500
          }}
        >
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
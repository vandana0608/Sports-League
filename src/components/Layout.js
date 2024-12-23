import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

function Layout({ children }) {
  const location = useLocation();
  
  return (
    <div className="layout">
      <header>
        <nav>
          <div className="nav-content">
            <img src="/Images/logo.svg" alt="League Web UI" className="logo" />
            <div className="nav-links">
              <Link 
                to="/schedule" 
                className={location.pathname === '/' || location.pathname === '/schedule' ? 'active' : ''}
              >
                <img src="/Images/schedule.png" alt="" />
                Schedule
              </Link>
              <Link 
                to="/leaderboard" 
                className={location.pathname === '/leaderboard' ? 'active' : ''}
              >
                <img src="/Images/leaderboard.png" alt="" />
                Leaderboard
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <div className="footer-content">
          <p>API Version: 1.0</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
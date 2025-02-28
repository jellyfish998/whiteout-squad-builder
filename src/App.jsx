import React from 'react';
import SquadBuilder from './components/SquadBuilder';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="logo">Whiteout Survival Squad Builder</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </nav>
      </header>
      <SquadBuilder />
      <footer className="footer">
        <div>
          <a href="#">Legal</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div>
        Follow Us
          {/* Replace these with actual social media links/icons */}
          <a href="#">
            <img src="twitter-icon.png" alt="Twitter" width="24" height="24"/>
          </a>
          <a href="#">
            <img src="facebook-icon.png" alt="Facebook" width="24" height="24"/>
            <img src="instagram-icon.png" alt="Instagram" width="24" height="24"/>
          </a>
        </div>
    </footer>

    </div>
  );
}

export default App;
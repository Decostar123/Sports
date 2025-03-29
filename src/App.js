import logo from './logo.svg';
import './App.css';
import { LoginPage, HomePage, PayoutCalculations, PayoutDetails, NewsAnalytics } from './pages';
import { SideBar } from './components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context';
import { ConfigProvider, theme } from "antd";
import { useDataProvider } from './context';
import { useEffect } from 'react';
function App() {
  const { authenticatedUserDetails } = useAuthContext();
  const { darkMode, toggleDarkMode } = useDataProvider();

  useEffect(() => {
    const mode = document.querySelector('body').getAttribute('data-theme');
    if (mode === 'dark') {
      toggleDarkMode(true);
    } else {
      toggleDarkMode(false)
    }
  }, [])

  document.querySelector('body').setAttribute('data-theme', darkMode ? 'dark' : 'light')
  return (

    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Router>
        <div className='app-container'>
          {authenticatedUserDetails && <SideBar />}

          <div className='content-container'>
            <Routes>
              {!authenticatedUserDetails ? (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              ) : (
                <>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/payoutCalculations" element={<PayoutCalculations />} />
                  <Route path="/payoutDetails" element={<PayoutDetails />} />
                  <Route path="/newsAnalytics" element={<NewsAnalytics />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </ConfigProvider>

  );
}

export default App;

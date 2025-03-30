import '.././App.css';
import { Switch } from 'antd';
import '../styles/loginPage.css';
import { useAuthContext } from '../context';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export function LoginPage() {
  const { setUserDetails } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(true);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      tokenResponse.isAdmin = isAdmin;
      setUserDetails(tokenResponse);
    },
  });
  return (
    <div className="outer-container">
      <div className="login-container">
        <div className="login-box">
          <button className="google-login-button" onClick={() => login()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path d="M23.49 12.27v7.46h-6.01v-7.46h6.01zm-6.01-3.24v2.56h-3.63v-2.56h3.63zm12.04 3.24v2.56h-3.62v-2.56h3.62zm-3.62 3.24v7.46h-6.01v-7.46h6.01zm-3.62-3.24v2.56h-3.62v-2.56h3.62zm-9.65 4.81v7.46h-6.01v-7.46h6.01zm-6.01-3.24v2.56h-3.63v-2.56h3.63zm12.04 3.24v2.56h-3.62v-2.56h3.62z" />
            </svg>
            Sign in with Google 🚀
          </button>
          <div className="login-options">
            <p className="login-text">Login As Admin</p>
            <Switch
              size="small"
              className="login-switch"
              value={isAdmin}
              
              onChange={(val) => setIsAdmin(val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

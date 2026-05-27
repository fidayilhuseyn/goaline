import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-black text-primary-dark tracking-tight">
                GoaLine
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center flex-1 justify-between ml-10">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/stadiums" className="text-slate-300 hover:text-white font-medium transition-colors">
                {t('nav.stadiums')}
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              
              <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                {!!user ? (
                  <>
                    <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors">
                      {t('nav.dashboard')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                      {t('nav.login')}
                    </Link>
                    <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link 
              to="/" 
              className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/stadiums" 
              className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.stadiums')}
            </Link>
            
            <div className="border-t border-slate-700 my-2 pt-2"></div>
            
            {!!user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-red-400 hover:bg-slate-800 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md font-medium"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="text-primary hover:bg-slate-800 block px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

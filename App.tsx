
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { DomainProvider } from './context/DomainContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { HistoryProvider } from './context/HistoryContext';
import { LanguageProvider } from './context/LanguageContext';

import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import AnalyzePage from './pages/AnalyzePage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AffiliatePage from './pages/AffiliatePage';
import ApiDocsPage from './pages/ApiDocsPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <DomainProvider>
            <ToastProvider>
              <HistoryProvider>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/generate" element={<GeneratePage />} />
                    <Route path="/analyze/:domain" element={<AnalyzePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/affiliate" element={<AffiliatePage />} />
                    <Route path="/api-docs" element={<ApiDocsPage />} />
                  </Routes>
                </MainLayout>
              </HistoryProvider>
            </ToastProvider>
          </DomainProvider>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

/**
 * Code Splitting - Rutas con carga diferida (lazy loading)
 * Reduce el bundle inicial y mejora performance
 */

import React, { lazy, Suspense } from 'react';

// Componentes cargados normalmente (críticos)
import MainPage from '../pages/MainPage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Componentes cargados con lazy loading (no críticos)
const ProfessionalDetail = lazy(() => import('../pages/ProfessionalDetail'));
const ProfessionalsPage = lazy(() => import('../pages/ProfessionalsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUs'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <p>Cargando página...</p>
  </div>
);

// Rutas configuración
export const routes = [
  {
    path: '/',
    element: <MainPage />,
    label: 'Inicio'
  },
  {
    path: '/profesionales',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProfessionalsPage />
      </Suspense>
    ),
    label: 'Profesionales'
  },
  {
    path: '/profesionales/:id',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProfessionalDetail />
      </Suspense>
    )
  },
  {
    path: '/contacto',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContactPage />
      </Suspense>
    ),
    label: 'Contacto'
  },
  {
    path: '/sobrenosotros',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AboutUsPage />
      </Suspense>
    ),
    label: 'Sobre Nosotros'
  }
];

export default routes;
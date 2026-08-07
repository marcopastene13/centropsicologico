/* ===== PROFESSIONAL DETAIL PAGE ===== */
.professional-detail-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

/* Hero section */
.professional-hero {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  padding: 2rem;
  margin-bottom: 2rem;
}

.professional-photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #0d6efd;
  box-shadow: 0 4px 15px rgba(13,110,253,0.2);
}

/* Booking cards row */
.booking-row {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

/* Individual booking card */
.booking-card {
  border-radius: 12px;
  overflow: hidden;
    min-height: 0;
  display: flex;
  flex-direction: column;
}

.booking-card-header {
  background: linear-gradient(135deg, #3a5f8a, #2c4a6e);
  color: white;
  padding: 0.875rem;
  font-size: 1rem;
}

/* ===== CARD 1: FECHA - CALENDARIO ===== */
.fecha-card-body {
  display: flex;
  flex-direction: column;
    padding: 0.5rem;
  flex: 1;
    gap: 0.25rem;
}

/* Barra de navegacion mes/anio */
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #3a5f8a, #2c4a6e);
  color: white;
  border-radius: 8px;
  padding: 0.5rem 0.6rem;
  flex-shrink: 0;
}

.cal-title {
  font-weight: 600;
  font-size: 0.88rem;
  text-transform: capitalize;
  flex: 1;
  text-align: center;
  letter-spacing: 0.02em;
}

.cal-nav-btn {
  background: none !important;
  border: none !important;
  color: white !important;
  font-size: 1.3rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.35rem;
  border-radius: 4px;
  transition: background 0.2s;
  font-weight: bold;
}
.cal-nav-btn:hover {
  background: rgba(255,255,255,0.25) !important;
}

/* Grid del calendario */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 2px;
  align-content: start;
  flex: 1;
}

/* Dias de semana header */
.cal-dow {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 700;
  color: #3a5f8a;
  padding: 3px 0;
  text-transform: uppercase;
}

/* Botones de dias */
.cal-day {
    aspect-ratio: 1;
  height: 34px;
  max-height: 34px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: none !important;
  border-radius: 50% !important;
  background: #eef2f7 !important;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
  color: #1a1a2e;
  width: 100%;
  outline: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.cal-day:hover:not(:disabled) {
  background: #bed4f0 !important;
  transform: scale(1.12);
}
.cal-day.selected {
  background: #4CAF50 !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(76,175,80,0.4) !important;
  transform: scale(1.1);
}
.cal-day.past {
  color: #c5c5c5 !important;
  background: transparent !important;
  cursor: not-allowed;
  font-weight: 400;
}
.cal-day:disabled {
  cursor: not-allowed;
}

/* Fecha seleccionada */
.cal-selected {
  font-size: 0.8rem;
  color: #555;
  text-align: center;
  padding: 0.3rem 0.5rem;
  background: #f0f7ff;
  border-radius: 6px;
  border: 1px solid #cce0f5;
  flex-shrink: 0;
  margin-top: auto;
}

/* ===== CARD 2: HORA ===== */
.hora-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
}

.hora-btn {
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid #d0d8e8;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #3a5f8a;
}
.hora-btn:hover {
  border-color: #3a5f8a;
  background: #f0f5ff;
  transform: translateY(-1px);
}
.hora-btn.selected {
  background: #3a5f8a;
  color: white;
  border-color: #3a5f8a;
  box-shadow: 0 2px 8px rgba(58,95,138,0.35);
}
.hora-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* ===== RESPONSIVO ===== */

/* Mobile - apilado vertical */
@media (max-width: 767px) {
  .detail-container {
    padding: 1rem 0.75rem;
  }

  .booking-row {
    flex-direction: column;
    gap: 1rem;
  }

  .booking-card {
    min-height: auto;
    width: 100% !important;
    overflow: visible;
  }

  .booking-card .card-body {
    overflow: visible;
  }

  .cal-grid {
    gap: 3px;
  }

  .cal-grid .btn {
    font-size: 0.7rem;
    padding: 4px 2px;
    min-width: 26px;
  }

  .cal-nav-btn {
    padding: 2px 8px;
    font-size: 0.75rem;
  }

  .detail-container h2 {
    font-size: 1.3rem;
  }

  .servicio-list {
    overflow: visible;
    max-height: none;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .booking-card {
    border-radius: 8px;
  }

  .cal-grid .btn {
    font-size: 0.62rem;
    padding: 3px 1px;
    min-width: 22px;
  }

  .detail-container h2 {
    font-size: 1.1rem;
  }
}

/* ===== BARRA DE PROGRESO ===== */
.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 64px;
}

.step-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e9edf3;
  color: #7a8699;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.25s;
}

.step-node.done .step-circle {
  background: linear-gradient(135deg, #3a5f8a, #2c4a6e);
  color: white;
  box-shadow: 0 2px 8px rgba(58,95,138,0.35);
}

.step-label {
  font-size: 0.72rem;
  color: #7a8699;
  font-weight: 600;
  text-align: center;
}

.step-node.done .step-label {
  color: #3a5f8a;
}

.step-line {
  width: 32px;
  height: 2px;
  background: #e9edf3;
  margin-bottom: 1.4rem;
  transition: background 0.25s;
}

.step-line.done {
  background: #3a5f8a;
}

@media (max-width: 480px) {
  .step-node { min-width: 50px; }
  .step-circle { width: 28px; height: 28px; font-size: 0.78rem; }
  .step-label { font-size: 0.62rem; }
  .step-line { width: 16px; margin-bottom: 1.1rem; }
}

/* ===== TARJETAS DE SESION (seleccionables, con precio) ===== */
.session-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: #f8f9fa;
  border: 2px solid #eef2f7;
  border-radius: 12px;
  padding: 1rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.session-card:hover {
  border-color: #a9c1de;
  background: #f0f5ff;
  transform: translateY(-2px);
}

.session-card.selected {
  border-color: #3a5f8a;
  background: #eef4fc;
  box-shadow: 0 4px 14px rgba(58,95,138,0.25);
}

.session-check {
  position: absolute;
  top: 8px;
  right: 10px;
  color: #3a5f8a;
  font-weight: 800;
  font-size: 0.95rem;
}

.session-label {
  font-size: 0.82rem;
  color: #444;
  font-weight: 600;
  min-height: 2.2em;
}

.session-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3a5f8a;
}

.session-note {
  font-size: 0.7rem;
  color: #888;
}

@media (max-width: 480px) {
  .session-price { font-size: 1.05rem; }
  .session-label { font-size: 0.74rem; min-height: 0; }
}

/* ===== PANEL DE RESUMEN ===== */
.summary-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #eef2f7;
  padding: 1.25rem;
}

@media (min-width: 992px) {
  .summary-card {
    position: sticky;
    top: 1rem;
  }
}

.summary-title {
  color: #3a5f8a;
  font-weight: 700;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  color: #555;
  padding: 0.4rem 0;
}

.summary-row strong {
  color: #1a1a2e;
  text-align: right;
  max-width: 60%;
}

.summary-total {
  font-size: 1.05rem;
}

.summary-total strong {
  color: #3a5f8a;
  font-size: 1.2rem;
}

.summary-hint {
  font-size: 0.72rem;
  color: #a33;
  text-align: center;
  margin: 0.5rem 0 0;
}

/* ===== CUADRO DE VALORES ===== */
.precio-item {
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #eef2f7;
}

.precio-label {
  font-size: 0.82rem;
  color: #555;
  font-weight: 500;
  min-height: 2.2em;
}

.precio-monto {
  font-size: 1.35rem;
  font-weight: 700;
  color: #3a5f8a;
}

.precio-nota {
  font-size: 0.72rem;
  color: #888;
}

@media (max-width: 480px) {
  .precio-monto {
    font-size: 1.1rem;
  }
  .precio-label {
    font-size: 0.75rem;
    min-height: 0;
  }
}

/* ===== CARD SERVICIO ===== */
.servicio-list {
  overflow-y: auto;
  max-height: 100%;
}

.servicio-list .btn {
  font-size: 0.82rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  transition: all 0.15s;
  white-space: normal;
  text-align: left;
}

.servicio-list .btn.active,
.servicio-list .btn-primary {
  background-color: #4a6fa5 !important;
  border-color: #4a6fa5 !important;
  color: #fff !important;
  font-weight: 600;
}
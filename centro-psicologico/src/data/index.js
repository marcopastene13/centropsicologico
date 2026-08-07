/**
 * Exporta todos los datos centralizados
 * Punto único de verdad para la aplicación
 */

export { professionals, getProfessionalById, getProfessionalsByService } from './professionals';
export { allServices, getServiceById } from './services';
export { serviceDetails, getServiceDetail, isValidModality } from './serviceDetails';
export { externalArticles } from './externalArticles';
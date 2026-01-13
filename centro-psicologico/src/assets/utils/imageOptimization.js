/**
 * Optimización de imágenes
 */

// Componente LazyImage - carga imágenes solo cuando son visibles
export const LazyImage = ({ src, alt, className, placeholder }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      placeholder={placeholder || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'}
    />
  );
};

// Generar imágenes responsivas con srcset
export const generateImageSrcSet = (imageName, formats = ['jpg', 'webp']) => {
  const sizes = [400, 600, 800, 1024];
  const srcset = sizes
    .flatMap((size) =>
      formats.map(
        (format) =>
          `/images/${imageName}-${size}w.${format} ${size}w`
      )
    )
    .join(', ');
  return srcset;
};

// Precargar imágenes críticas
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

export default { LazyImage, generateImageSrcSet, preloadCriticalImages };
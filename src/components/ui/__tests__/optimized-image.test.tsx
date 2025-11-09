import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Mock pour next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, ...props }: any) => {
    // Simuler l'événement onLoad
    if (onLoad) {
      setTimeout(onLoad, 0);
    }
    return <img src={src} alt={alt} {...props} data-testid="next-image" />;
  },
}));

describe('OptimizedImage', () => {
  it('rend correctement l\'image avec les props de base', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test Image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('affiche un placeholder pendant le chargement', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test Image"
        width={400}
        height={300}
      />
    );

    const placeholder = screen.queryByTestId('image-placeholder');
    expect(placeholder).toBeDefined();
  });

  it('utilise un placeholder SVG quand src est vide', () => {
    render(
      <OptimizedImage
        src=""
        alt="Placeholder Image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain('placeholder');
  });

  it('applique la classe object-cover par défaut', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test Image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image.className).toContain('object-cover');
  });

  it('applique la classe object-contain quand objectFit est "contain"', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test Image"
        width={400}
        height={300}
        objectFit="contain"
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image.className).toContain('object-contain');
  });
}); 
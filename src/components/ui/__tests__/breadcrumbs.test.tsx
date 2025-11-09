import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

describe('Breadcrumbs', () => {
  it('rend correctement les éléments du fil d\'Ariane', () => {
    const items = [
      { label: 'Accueil', href: '/' },
      { label: 'Notre Église', href: '/notre-eglise' },
      { label: 'Qui sommes-nous', href: '/notre-eglise/qui-sommes-nous', isCurrent: true },
    ];

    render(<Breadcrumbs items={items} />);

    // Vérifier que tous les éléments sont rendus
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Notre Église')).toBeInTheDocument();
    expect(screen.getByText('Qui sommes-nous')).toBeInTheDocument();

    // Vérifier que les liens sont correctement rendus
    const homeLink = screen.getByText('Accueil').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    const churchLink = screen.getByText('Notre Église').closest('a');
    expect(churchLink).toHaveAttribute('href', '/notre-eglise');

    // Vérifier que l'élément courant n'est pas un lien mais un span
    const currentItem = screen.getByText('Qui sommes-nous');
    expect(currentItem.closest('span')).toBeInTheDocument();
    expect(currentItem.closest('a')).toBeNull();
  });

  it('rend correctement un seul élément', () => {
    const items = [
      { label: 'Accueil', href: '/', isCurrent: true },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Accueil')).toBeInTheDocument();
    // Vérifier qu'il n'y a pas de séparateur (ChevronRight)
    expect(screen.queryByTestId('chevron-right-icon')).toBeNull();
  });
}); 
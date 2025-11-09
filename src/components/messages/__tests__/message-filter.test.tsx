import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MessageFilter } from '../message-filter';

const mockThemeOptions = [
  { value: 'all', label: 'Tous les thèmes' },
  { value: 'evangile', label: 'L\'Évangile' },
];

const mockPreacherOptions = [
  { value: 'all', label: 'Tous les prédicateurs' },
  { value: 'pasteur-dupont', label: 'Pasteur Samuel Dupont' },
];

const mockDateOptions = [
  { value: 'all', label: 'Toutes les dates' },
  { value: 'recent', label: '3 derniers mois' },
];

describe('MessageFilter', () => {
  it('rend toutes les options de filtre', () => {
    const mockOnFilterChange = jest.fn();
    
    render(
      <MessageFilter
        themeOptions={mockThemeOptions}
        preacherOptions={mockPreacherOptions}
        dateOptions={mockDateOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Vérifier que les labels sont rendus
    expect(screen.getByText('Thème')).toBeInTheDocument();
    expect(screen.getByText('Prédicateur')).toBeInTheDocument();
    expect(screen.getByText('Période')).toBeInTheDocument();
    expect(screen.getByText('Trier par')).toBeInTheDocument();
  });

  it('appelle onFilterChange quand un filtre est modifié', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = jest.fn();
    
    render(
      <MessageFilter
        themeOptions={mockThemeOptions}
        preacherOptions={mockPreacherOptions}
        dateOptions={mockDateOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Trouver et cliquer sur le trigger du Select
    const themeSelect = screen.getByLabelText('Thème');
    await user.click(themeSelect);

    // Attendre que le popover s'ouvre et choisir une option
    await waitFor(() => {
      expect(screen.getByText('L\'Évangile')).toBeInTheDocument();
    });
    
    // Cliquer sur une option
    await user.click(screen.getByText('L\'Évangile'));
    
    // Vérifier que onFilterChange a été appelé avec les bons arguments
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      theme: 'evangile'
    }));
  });
}); 
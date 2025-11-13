import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

beforeAll(() => {
  // Define a mock test context if it doesn't already exist
  if (!global.__TEST_CONTEXT__) {
    global.__TEST_CONTEXT__ = {
      seededPerk: {
        title: 'Test Perk Title',
        merchant: 'Test Merchant',
      },
    };
  }
});

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait until the mock perk appears
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() =>
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument()
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the seeded perk to appear
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    // Simulate merchant filter dropdown
    const merchantSelect = screen.getByRole('combobox');
    fireEvent.change(merchantSelect, {
      target: { value: seededPerk.merchant },
    });

    await waitFor(() =>
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument()
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});

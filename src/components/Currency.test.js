import { render, fireEvent, screen } from '@testing-library/react';
import Currency from './Currency';

describe("Currency component", () => {
    test('renders the balance', () => {
          render(<Currency />);
          const balanceEl = screen.getByText("Balance", {exact: false});
          expect(balanceEl).toBeInTheDocument();
    });
});

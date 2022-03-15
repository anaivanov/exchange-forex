import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Exchange from './Exchange';

describe("Exchange component", () => {
    test('renders the button', () => {
          render(<Exchange />);
          const swapBtn = screen.getAllByRole("button")[0];

          const actionBtn = screen.getAllByRole("button")[1];
          expect(actionBtn).toHaveTextContent("Sell", {exact: false});

          userEvent.click(swapBtn);

          expect(actionBtn).toHaveTextContent("Buy", {exact: false});
    });

});

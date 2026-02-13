import { render, screen } from '@testing-library/react';
import App from './App';

test('renders carbon calculator', () => {
  render(<App />);
  const headingElement = screen.getByText(/Carbon Emission Calculator/i);
  expect(headingElement).toBeInTheDocument();
});

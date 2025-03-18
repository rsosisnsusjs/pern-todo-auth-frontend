import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock toast notification
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock localStorage
beforeEach(() => {
  jest.spyOn(Storage.prototype, 'setItem'); // Mock setItem directly for testing
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mocked-token'); // Mock getItem to return a mocked token
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ jwtToken: 'mocked-token' }),
  })
);

describe('Login Component', () => {
  const setAuthMock = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    setAuthMock.mockClear();
    render(
      <BrowserRouter>
        <Login setAuth={setAuthMock} />
      </BrowserRouter>
    );
  });

  test('renders login form', () => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('updates input values correctly', () => {
    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits the login form successfully', async () => {
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Ensure fetch is called once
    expect(setAuthMock).toHaveBeenCalledWith(true); // Check if authentication is set correctly
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mocked-token'); // Ensure token is saved in localStorage
    expect(toast.success).toHaveBeenCalledWith('Logged in Successfully', { autoClose: 1000 }); // Check success toast
  });

  test('shows error when login fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve('Invalid credentials'), // Simulate error response
      })
    );

    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Ensure fetch is called once
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials'); // Check error toast
    expect(setAuthMock).toHaveBeenCalledWith(false); // Check if authentication is set to false
  });
});

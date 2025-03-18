import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock toast notification
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ jwtToken: 'mocked-token' })
  })
);

describe('Register Component', () => {
  const setAuthMock = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    setAuthMock.mockClear();
    render(
      <BrowserRouter>
        <Register setAuth={setAuthMock} />
      </BrowserRouter>
    );
  });

  test('renders register form', () => {
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('updates input values correctly', () => {
    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const nameInput = screen.getByPlaceholderText('name');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(nameInput.value).toBe('John Doe');
  });

  test('submits the register form successfully', async () => {
    fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John Doe' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(setAuthMock).toHaveBeenCalledWith(true);
    expect(localStorage.getItem('token')).toBe('mocked-token');
    expect(toast.success).toHaveBeenCalledWith('Register Successfully');
  });

  test('shows error when register fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve('Email already taken')
      })
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Email already taken'));
    expect(setAuthMock).toHaveBeenCalledWith(false);
  });
});

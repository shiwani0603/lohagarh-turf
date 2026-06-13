/**
 * Common reusable components
 */

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div>
      {label && <label className="block text-sm font-semibold mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

export const Loading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mr-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: string;
}> = ({ title, description, icon = '📭' }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export const ErrorBoundary: React.FC<{ error: any; reset: () => void }> = ({
  error,
  reset,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h2 className="text-lg font-bold text-red-800 mb-2">Something went wrong!</h2>
      <p className="text-red-600 mb-4">{error?.message || 'An error occurred'}</p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
};

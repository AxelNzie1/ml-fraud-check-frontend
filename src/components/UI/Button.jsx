const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    loading = false, 
    disabled = false, 
    onClick, 
    className = '',
    type = 'button'
  }) => {
    const baseClasses = 'btn';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
      outline: 'btn-outline'
    };
    
    const sizeClasses = {
      small: 'btn-sm',
      medium: 'btn-md',
      large: 'btn-lg'
    };
  
    return (
      <button
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${loading ? 'loading' : ''}`}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading ? (
          <>
            <div className="btn-loader"></div>
            <span>Chargement...</span>
          </>
        ) : children}
      </button>
    );
  };
  
  export default Button;
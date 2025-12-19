const Card = ({ children, className = '', hover = false, elevation = 'md' }) => {
    const elevationClasses = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };
  
    return (
      <div className={`card ${elevationClasses[elevation]} ${hover ? 'card-hover' : ''} ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
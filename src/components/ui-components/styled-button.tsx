// reusable stylized button component

export default function Button({ 
    onClick, 
    children 
  }: { 
    onClick: () => void; 
    children: React.ReactNode; 
  }) {
    return (
      <button 
        className="mb-2 px-4 py-2 h-fit text-md font-header bg-primary text-background rounded 
      hover:bg-white cursor-pointer" 
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
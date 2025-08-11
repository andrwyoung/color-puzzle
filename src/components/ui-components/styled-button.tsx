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
        className="mb-2 px-4 py-2 text-2xl font-header bg-emerald-400 text-white rounded hover:bg-emerald-300 cursor-pointer" 
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
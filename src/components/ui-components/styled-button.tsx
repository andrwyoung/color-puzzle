export default function Button({
  onClick,
  children,
  title,
  ariaLabel
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className="mb-2 px-4 py-2 h-fit text-md font-header bg-primary text-background rounded 
      hover:bg-white cursor-pointer"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
    >
      {children}
    </button>
  );
}

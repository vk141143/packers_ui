import * as React from "react";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
};

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = "", children, ...props }, ref) => {
  const { open, setOpen } = useSelectContext();

  return (
    <button
      type="button"
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex justify-between items-center ${className}`}
      onClick={() => setOpen(!open)}
      ref={ref}
      {...props}
    >
      {children}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
});

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", children, ...props }, ref) => {
  const { open, setOpen } = useSelectContext();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, ref, setOpen]);

  if (!open) return null;

  return (
    <div
      className={`absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ className = "", children, value, ...props }, ref) => {
  const { onValueChange, setOpen } = useSelectContext();

  const handleClick = () => {
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <div
      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }>(({ className = "", placeholder, ...props }, ref) => {
  const { value } = useSelectContext();

  return (
    <span
      className={`${!value ? 'text-gray-500' : 'text-gray-900'} ${className}`}
      ref={ref}
      {...props}
    >
      {value || placeholder}
    </span>
  );
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
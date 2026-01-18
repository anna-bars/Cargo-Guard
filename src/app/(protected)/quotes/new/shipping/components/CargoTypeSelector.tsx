import { Cpu, Shirt, Cog, Apple, FlaskConical, Pill, Box } from 'lucide-react';

interface CargoTypeSelectorProps {
  cargoType: string;
  otherCargoType: string;
  onCargoTypeSelect: (type: string) => void;
  onOtherCargoTypeChange: (value: string) => void;
}

const CargoTypeSelector: React.FC<CargoTypeSelectorProps> = ({
  cargoType,
  otherCargoType,
  onCargoTypeSelect,
  onOtherCargoTypeChange
}) => {
  const cargoOptions = [
    { value: 'electronics', label: 'Electronics', icon: Cpu },
    { value: 'clothing', label: 'Clothing', icon: Shirt },
    { value: 'machinery', label: 'Machinery', icon: Cog },
    { value: 'food', label: 'Food Products', icon: Apple },
    { value: 'chemicals', label: 'Chemicals', icon: FlaskConical },
    { value: 'pharma', label: 'Pharmaceuticals', icon: Pill },
    { value: 'other', label: 'Other', icon: Box },
  ];

  const handleCargoTypeSelect = (type: string) => {
    onCargoTypeSelect(type);
    if (type !== 'other') {
      onOtherCargoTypeChange('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Cargo Information</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#868686] mb-2">
            Cargo Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {cargoOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCargoTypeSelect(option.value)}
                  className={`
                    p-3 md:p-4 rounded-xl border-2 transition-all duration-200
                    ${cargoType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`
                      p-2 md:p-3 rounded-lg
                      ${cargoType === option.value
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-[#868686] text-center leading-tight">
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Other Cargo Type Input Field */}
          {cargoType === 'other' && (
            <div className="mt-4 animate-fadeIn">
              <label className="block text-sm font-medium text-[#868686] mb-2">
                Please specify cargo type *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otherCargoType}
                  onChange={(e) => onOtherCargoTypeChange(e.target.value)}
                  placeholder="Enter cargo type"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
                  required
                  maxLength={50}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Please provide a detailed description of your cargo
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CargoTypeSelector;
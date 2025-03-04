import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";

interface DropdownFieldProps {
  item: {
    label: string;
    name: string;
    fieldType: string;
    options: string[];
    required?: boolean;
    column?: number;
    icon?: string;
    // Nom de l'icône à utiliser
  };
  defaultValue: string 
  handleInputChange: (name: string, value: string) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ item, handleInputChange, defaultValue }) => {
  // Récupération dynamique de l'icône si elle est fournie

  return (
    <div className="flex items-center space-x-2 w-full ">
      <Select required={item.required} defaultValue={defaultValue} onValueChange={(value) => handleInputChange(item.name, value)} >
        <SelectTrigger className="w-full cursor-pointer" >
          <SelectValue placeholder={item.label || "Sélectionner une option"} />
        </SelectTrigger>
        <SelectContent>
          {item.options?.length > 0 ? (
            item.options.map((option, index) => (
              <SelectItem value={option} key={index}  className="hover:bg-blue-600 cursor-pointer font-bold bg-white text-blue-600 hover:text-white">
                {option}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              Aucune option disponible
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownField;

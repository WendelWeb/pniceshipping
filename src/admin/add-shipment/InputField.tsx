import { Input } from "../../components/ui/input";
interface InputFieldProps {
  handleInputChange: (name: string, value: string | number) => void;
  item: {
    name: string;
    fieldType: string;
    placeholder?: string;
    required?: boolean;
    label?: string;
    min?: number;
    max?: number;
  };
  defaultValue?: string;
}
const InputField = ({ handleInputChange, item,defaultValue }: InputFieldProps) => {
  return (
    <div>
      <Input
      defaultValue={defaultValue? defaultValue : ''}
        type={item?.fieldType}
        name={item?.name}
        required={item?.required}
        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
      />
    </div>
  );
};

export default InputField;

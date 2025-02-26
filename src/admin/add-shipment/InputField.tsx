import { Input } from "../../components/ui/input";
interface InputFieldProps {
  handleIputChange: (name: string, value: string | number) => void;
  item: {
    name: string;
    fieldType: string;
    placeholder?: string;
    required?: boolean;
    label?: string;
    min?: number;
    max?: number;
  };
}
const InputField = ({ handleIputChange, item }: InputFieldProps) => {
  return (
    <div>
      <Input
        type={item?.fieldType}
        name={item?.name}
        required={item?.required}
        onChange={(e) => handleIputChange(e.target.name, e.target.value)}
      />
    </div>
  );
};

export default InputField;

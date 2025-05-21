// import { Input } from "../../components/ui/input";
// interface InputFieldProps {
//   handleIputChange: (name: string, value: string | number) => void;
//   item: {
//     name: string;
//     fieldType: string;
//     placeholder?: string;
//     required?: boolean;
//     label?: string;
//     min?: number;
//     max?: number;
//   };
//   defaultValue?: string;
// }
// const InputField = ({ handleIputChange, item,defaultValue }: InputFieldProps) => {
//   return (
//     <div>
//       <Input
//       defaultValue={defaultValue? defaultValue : ''}
//         type={item?.fieldType}
//         name={item?.name}
//         required={item?.required}
//         onChange={(e) => handleIputChange(e.target.name, e.target.value)}
//       />
//     </div>
//   );
// };

// export default InputField;
// InputField.tsx
import { ShipmentFormItem } from "@/types/shipment.ts";
import { FC } from "react";

interface InputFieldProps {
  item: ShipmentFormItem;
  defaultValue: string;
  handleInputChange: (name: string, value: any) => void;
}

const InputField: FC<InputFieldProps> = ({ item, defaultValue, handleInputChange }) => {
  return (
    <input
      type={item.fieldType}
      name={item.name}
      value={defaultValue}
      onChange={(e) => handleInputChange(item.name, e.target.value)}
      required={item.required}
      className="mt-1 p-2 w-full border rounded"
    />
  );
};

export default InputField;
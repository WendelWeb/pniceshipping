import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
const DropdownField = ({ item, handleInputChange, defaultValue }) => {
    // Récupération dynamique de l'icône si elle est fournie
    return (_jsx("div", { className: "flex items-center space-x-2 w-full ", children: _jsxs(Select, { required: item.required, defaultValue: defaultValue, onValueChange: (value) => handleInputChange(item.name, value), children: [_jsx(SelectTrigger, { className: "w-full cursor-pointer", children: _jsx(SelectValue, { placeholder: item.label || "Sélectionner une option" }) }), _jsx(SelectContent, { children: item.options?.length > 0 ? (item.options.map((option, index) => (_jsx(SelectItem, { value: option, className: "hover:bg-blue-600 cursor-pointer font-bold bg-white text-blue-600 hover:text-white", children: option }, index)))) : (_jsx(SelectItem, { value: "", disabled: true, children: "Aucune option disponible" })) })] }) }));
};
export default DropdownField;

import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "../../components/ui/input";
const InputField = ({ handleIputChange, item, defaultValue }) => {
    return (_jsx("div", { children: _jsx(Input, { defaultValue: defaultValue ? defaultValue : '', type: item?.fieldType, name: item?.name, required: item?.required, onChange: (e) => handleIputChange(e.target.name, e.target.value) }) }));
};
export default InputField;

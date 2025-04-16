import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Button = ({ text }) => {
    return (_jsxs("button", { className: "bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors w-full flex items-center justify-center", children: [text, _jsx("svg", { className: "w-4 h-4 ml-2 translate-y-[2px]", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] }));
};
export default Button;

import { jsx as _jsx } from "react/jsx-runtime";
import * as Icons from "./indexIcon";
// Map des icônes avec le bon type
const iconMap = {
    FaClipboardList: _jsx(Icons.FaClipboardList, {}),
    FaTag: _jsx(Icons.FaTag, {}),
    FaDollarSign: _jsx(Icons.FaDollarSign, {}),
    FaMoneyBillAlt: _jsx(Icons.FaMoneyBillAlt, {}),
    FaCar: _jsx(Icons.FaCar, {}),
    FaCheckCircle: _jsx(Icons.FaCheckCircle, {}),
    FaIndustry: _jsx(Icons.FaIndustry, {}),
    FaCarSide: _jsx(Icons.FaCarSide, {}),
    FaCalendarAlt: _jsx(Icons.FaCalendarAlt, {}),
    FaRoad: _jsx(Icons.FaRoad, {}),
    FaCogs: _jsx(Icons.FaCogs, {}),
    FaGasPump: _jsx(Icons.FaGasPump, {}),
    FaTachometerAlt: _jsx(Icons.FaTachometerAlt, {}),
    FaWrench: _jsx(Icons.FaWrench, {}),
    FaCircle: _jsx(Icons.FaCircle, {}),
    FaPalette: _jsx(Icons.FaPalette, {}),
    FaDoorClosed: _jsx(Icons.FaDoorClosed, {}),
    FaIdCard: _jsx(Icons.FaIdCard, {}),
    FaTags: _jsx(Icons.FaTags, {}),
    FaFileAlt: _jsx(Icons.FaFileAlt, {}),
    FaBarcode: _jsx(Icons.FaBarcode, {}),
    FaUser: _jsx(Icons.FaUser, {}),
    GiWeightScale: _jsx(Icons.GiWeightScale, {}),
    MdEmail: _jsx(Icons.MdEmail, {}),
    FaHouse: _jsx(Icons.FaHouse, {})
};
const IconField = ({ icon }) => {
    // Vérifier si l'icône existe dans notre map
    const isValidIcon = icon && icon in iconMap;
    return (_jsx("div", { className: "text-primary bg-blue-100 p-1.5 rounded-full", children: isValidIcon ? iconMap[icon] : null }));
};
export default IconField;

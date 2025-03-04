import React, { ReactElement } from 'react';
import * as Icons from "./indexIcon";

// Définition de tous les noms d'icônes possibles
type IconName = 
  | 'FaClipboardList'
  | 'FaTag'
  | 'FaDollarSign'
  | 'FaMoneyBillAlt'
  | 'FaCar'
  | 'FaCheckCircle'
  | 'FaIndustry'
  | 'FaCarSide'
  | 'FaCalendarAlt'
  | 'FaRoad'
  | 'FaCogs'
  | 'FaGasPump'
  | 'FaTachometerAlt'
  | 'FaWrench'
  | 'FaCircle'
  | 'FaPalette'
  | 'FaDoorClosed'
  | 'FaIdCard'
  | 'FaTags'
  | 'FaFileAlt'
  | 'FaBarcode'
  | 'FaUser'
  | 'GiWeightScale'
  | 'MdEmail'
  | 'FaHouse'
  ;

// Map des icônes avec le bon type
const iconMap: Record<IconName, ReactElement> = {
  FaClipboardList: <Icons.FaClipboardList />,
  FaTag: <Icons.FaTag />,
  FaDollarSign: <Icons.FaDollarSign />,
  FaMoneyBillAlt: <Icons.FaMoneyBillAlt />,
  FaCar: <Icons.FaCar />,
  FaCheckCircle: <Icons.FaCheckCircle />,
  FaIndustry: <Icons.FaIndustry />,
  FaCarSide: <Icons.FaCarSide />,
  FaCalendarAlt: <Icons.FaCalendarAlt />,
  FaRoad: <Icons.FaRoad />,
  FaCogs: <Icons.FaCogs />,
  FaGasPump: <Icons.FaGasPump />,
  FaTachometerAlt: <Icons.FaTachometerAlt />,
  FaWrench: <Icons.FaWrench />,
  FaCircle: <Icons.FaCircle />,
  FaPalette: <Icons.FaPalette />,
  FaDoorClosed: <Icons.FaDoorClosed />,
  FaIdCard: <Icons.FaIdCard />,
  FaTags: <Icons.FaTags />,
  FaFileAlt: <Icons.FaFileAlt />,
  FaBarcode: <Icons.FaBarcode />,
  FaUser: <Icons.FaUser />,
  GiWeightScale: <Icons.GiWeightScale />,
  MdEmail: <Icons.MdEmail />,
  FaHouse: <Icons.FaHouse />
};

interface IconFieldProps {
  icon?: IconName | string;
}

const IconField: React.FC<IconFieldProps> = ({ icon }) => {
  // Vérifier si l'icône existe dans notre map
  const isValidIcon = icon && icon in iconMap;
  
  return (
    <div className="text-primary bg-blue-100 p-1.5 rounded-full">
      {isValidIcon ? iconMap[icon as IconName] : null}
    </div>
  );
};

export default IconField;
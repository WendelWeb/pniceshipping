import { Package, Smartphone, Laptop, Tv, Shirt, ShoppingBag, Pill, Gift, Watch } from "lucide-react";

const items = [
  { name: "Téléphone", icon: Smartphone, weight: "0.5 - 1 kg", size: "10 x 5 x 2 cm" },
  { name: "Ordinateur Portable", icon: Laptop, weight: "1 - 3 kg", size: "30 x 20 x 3 cm" },
  { name: "Télévision", icon: Tv, weight: "5 - 15 kg", size: "80 x 50 x 10 cm" },
  { name: "Colis Standard", icon: Package, weight: "1 - 10 kg", size: "Variable" },
  { name: "Vêtements", icon: Shirt, weight: "Variable", size: "Dépend du colis" },
  { name: "Gadgets", icon: ShoppingBag, weight: "Variable", size: "Dépend du type" },
  { name: "Suppléments", icon: Pill, weight: "Variable", size: "Petits flacons/boîtes" },
  { name: "Médicaments", icon: Pill, weight: "Variable", size: "Dépend de l'emballage" },
  { name: "Cosmétiques", icon: Gift, weight: "Variable", size: "Petits pots ou tubes" },
  { name: "Accessoires de Mode", icon: Watch, weight: "Variable", size: "Montres, lunettes, bijoux" },
];

export default function ShippingGuide() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-5" id="guide">
      <h2 className="text-2xl font-bold mb-4 text-center">Envoyez n'importe quel colis !</h2>
      <p className="text-gray-600 text-center mb-6">
        Vous pouvez envoyer une large variété d'articles sans restriction de poids. Voici quelques exemples courants :
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(({ name, icon: Icon, weight, size }) => (
          <div key={name} className="p-4 border rounded-lg shadow flex flex-col items-center text-center bg-gray-50">
            <Icon className="w-12 h-12 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Poids : {weight}</p>
              <p>Taille : {size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

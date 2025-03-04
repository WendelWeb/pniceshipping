import Button from "@/components/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Info,  Users, Bell, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <>
    <Link to="/" className="mt-20">
    <Button text="revenir la sur page d'acceuil" />
    </Link>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 text-center">
    
        <div className="flex items-center justify-center mb-6">
          <Info className="w-16 h-16 text-blue-600" />
        </div>
        <CardContent>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">À propos de notre application</h1>
          <p className="text-gray-600 text-lg mb-6">
            Une solution moderne pour la gestion efficace des colis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <Activity className="w-10 h-10 text-blue-500" />
              <p className="mt-2 text-gray-700 font-medium">Suivi en Temps Réel</p>
            </div>
            <div className="flex flex-col items-center">
              <Bell className="w-10 h-10 text-yellow-500" />
              <p className="mt-2 text-gray-700 font-medium">Notifications Automatiques</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-10 h-10 text-green-500" />
              <p className="mt-2 text-gray-700 font-medium">Gestion Intuitive</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800 font-bold text-xl mb-6">
            <div className="flex flex-col items-center">
              <p className="text-2xl text-blue-600">12K+</p>
              <p>Colis Livrés</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl text-green-600">5K+</p>
              <p>Utilisateurs</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl text-red-600">30+</p>
              <p>Partenaires</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800">Notre Équipe</h2>
            <p className="text-gray-600 mt-2">Des experts passionnés par la logistique et la technologie.</p>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800">Nous Contacter</h2>
          </div>
        </CardContent>
      </Card>
    </div>
    <Link to="/">
    <Button text="revenir la sur page d'acceuil" />
    </Link>
    </>
  );
}

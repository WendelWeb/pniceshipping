import { useState, useEffect } from 'react';
import { getAllShipments, updateShipmentStatus } from '../utils/shipmentQueries';
import { sendTransitEmail } from '../services/emailServices';
import { Shipment } from '@/types/shipment';

const MarkShipmentAsTransit = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingShipments, setUpdatingShipments] = useState<Record<string, boolean>>({}); // État pour suivre les colis en cours de mise à jour

  useEffect(() => {
    fetchReceivedShipments();
  }, []);

  const fetchReceivedShipments = async () => {
    try {
      setLoading(true);
      const results = await getAllShipments();
      const receivedShipments = results
        .filter((shipment) => shipment.status === 'Recu📦')
        .map((shipment) => ({
          ...shipment,
          statusDates: Array.isArray(shipment.statusDates)
            ? shipment.statusDates // Si c'est un tableau, on le garde
            : [], // Sinon, tableau vide par défaut
        })) as Shipment[];
  
      // Initialiser updatingShipments pour chaque colis à false
      const initialUpdatingState = receivedShipments.reduce<Record<string, boolean>>(
        (acc, shipment) => {
          acc[shipment.trackingNumber] = false;
          return acc;
        },
        {}
      );
      setUpdatingShipments(initialUpdatingState);
      setShipments(receivedShipments);
    } catch (error) {
      console.error('Erreur lors de la récupération des colis reçus:', error);
    } finally {
      setLoading(false);
    }
  };

  const transitShipment = async (trackingNumber:string) => {
    try {
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: true }));
      await updateShipmentStatus(trackingNumber, 'En Transit✈️', 'Colis En cours de transit vers sa destination finale');
      const shipment = shipments.find((s) => s.trackingNumber === trackingNumber);
      
      if (shipment) {
        // Appeler l'email avant de retirer l'élément de shipments
        await sendTransitEmail(`${shipment.fullName}`, `${shipment.emailAdress}`, `${shipment.trackingNumber}`);
        // Mise à jour de l'interface utilisateur après l'envoi de l'email
        setShipments((prev) => prev.filter((s) => s.trackingNumber !== trackingNumber));
      } else {
        console.warn(`Colis avec trackingNumber ${trackingNumber} non trouvé`);
      }
      
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: false }));
    } catch (error) {
      console.error('Erreur lors du passage en transit:', error);
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: false }));
    }
  };

  const filteredShipments = shipments.filter((shipment) =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.emailAdress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Passage en Transit</h2>
          <p className="text-gray-600 mt-2">Gérez les colis reçus pour les passer en transit</p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-gray-600">
            {filteredShipments.length} colis reçus
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-500">
              {searchTerm ? "Aucun résultat trouvé pour votre recherche." : "Aucun colis reçu à passer en transit."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.trackingNumber}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-blue-500 px-4 py-2 text-white flex justify-between items-center">
                  <h3 className="font-medium">#{shipment.trackingNumber}</h3>
                  <span className="bg-green-400 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Reçu
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-gray-700">{shipment.userName}</p>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-700 text-sm">{shipment.emailAdress}</p>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M6 7H3m15 0h3M6 7H3m15 0h3"
                        />
                      </svg>
                      <p className="text-gray-700">{shipment.weight} lbs</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => transitShipment(shipment.trackingNumber)}
                      disabled={updatingShipments[shipment.trackingNumber]}
                      className={`w-full px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                        !updatingShipments[shipment.trackingNumber]
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {updatingShipments[shipment?.trackingNumber] ? (
                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      )}
                      Passer en Transit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkShipmentAsTransit;
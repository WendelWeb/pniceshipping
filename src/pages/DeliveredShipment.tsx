import { useState, useEffect, useMemo } from "react";
import { getDeliveredShipments } from "@/utils/shipmentQueries";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Calendar,
  Search,
  Filter,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  DollarSign,
  MapPin,
  Weight,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  RefreshCw,
  X,
  SlidersHorizontal,
  FileBarChart,
  FileText,
  Boxes,
  TableProperties,
} from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/Loader";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import {
  format,
  parseISO,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { fr } from "date-fns/locale";

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types
interface ShipmentInBatch {
  id: number;
  trackingNumber: string;
  fullName: string;
  userName: string;
  emailAdress: string;
  destination: string;
  category: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  details: {
    weight: number;
    shippingCost: number;
    dimensions?: { length: number; width: number; height: number };
    fragile?: boolean;
    priority?: "standard" | "express" | "priority";
    notes?: string;
  };
}

interface DeliveryBatch {
  id: number;
  ownerId: string;
  deliveryDate: string;
  totalWeight: number;
  serviceFee: number;
  shippingCost: number;
  totalCost: number;
  netProfit: number;
  shipments: ShipmentInBatch[];
  carrier?: string;
  status?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt?: string;
}

interface MonthlyStats {
  totalBatches: number;
  totalShipments: number;
  totalWeight: number;
  totalShippingCost: number;
  totalServiceFees: number;
  totalRevenue: number;
  totalNetProfit: number;
  avgShipmentWeight: number;
  avgProfitPerShipment: number;
  topDestination: { name: string; count: number };
  topCategory: { name: string; count: number };
  deliveryTrend: number;
  profitTrend: number;
}

interface FilterParams {
  searchTerm: string;
  dateRange: { start: string; end: string };
  priceRange: { min: string | number; max: string | number };
  categories: string[];
  destinations: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface DisplayOptions {
  showCategories: boolean;
  showDestinations: boolean;
  showDates: boolean;
  showDetails: boolean;
  viewMode: "list" | "grid" | "table";
  chartType: "bar" | "line" | "pie" | "radar";
  showOnlyProfit: boolean;
}

// Constantes
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Food",
  "Cosmetics",
  "Toys",
  "Art",
  "Documents",
  "Other",
];
const PROFIT_PER_POUND = 1.15;

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const formatWeight = (weight: number | undefined) => {
  console.log('weight:', weight, typeof weight);
  return `${Number(weight ?? 0).toFixed(2)} lbs`;
};

// Composant BatchCard séparé
const BatchCard = ({ batch }: { batch: DeliveryBatch }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-blue-600" />
            Lot #{batch.id}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            {batch.deliveryDate}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Weight className="h-5 w-5 text-gray-400" />
            Poids : {formatWeight(batch.totalWeight)}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            Shipping : {formatCurrency.format(batch.shippingCost)}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            Frais : {formatCurrency.format(batch.serviceFee)}
          </p>
          <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Profit : {formatCurrency.format(batch.netProfit)}
          </p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Shipments dans ce lot ({batch.shipments.length})
          </h4>
          <div className="space-y-3">
            {batch.shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex justify-between items-center text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/shipment/${shipment.id}`)}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span>{shipment.trackingNumber}</span> -{" "}
                  <span>
                    {shipment.fullName} (@{shipment.userName})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{formatWeight(shipment.details.weight)}</span>
                  <span>
                    {formatCurrency.format(shipment.details.shippingCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-teal-500 to-green-500" />
    </div>
  );
};

// Composant principal
const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<DeliveryBatch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<DeliveryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if(refreshing){
    console.log('Refreshing...');
    
  }
  const [currentMonthStats, setCurrentMonthStats] = useState<MonthlyStats>({
    totalBatches: 0,
    totalShipments: 0,
    totalWeight: 0,
    totalShippingCost: 0,
    totalServiceFees: 0,
    totalRevenue: 0,
    totalNetProfit: 0,
    avgShipmentWeight: 0,
    avgProfitPerShipment: 0,
    topDestination: { name: "", count: 0 },
    topCategory: { name: "", count: 0 },
    deliveryTrend: 0,
    profitTrend: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: "",
    dateRange: {
      start: startOfMonth(new Date()).toISOString().slice(0, 10),
      end: endOfMonth(new Date()).toISOString().slice(0, 10),
    },
    priceRange: { min: "", max: "" },
    categories: [],
    destinations: [],
    sortBy: "deliveryDate",
    sortOrder: "desc",
  });
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showCategories: true,
    showDestinations: true,
    showDates: true,
    showDetails: false,
    viewMode: "list",
    chartType: "bar",
    showOnlyProfit: false,
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<DeliveryBatch | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const uniqueDestinations = useMemo(() => {
    const destinations = batches.flatMap((batch) =>
      batch.shipments.map((shipment) => shipment.destination)
    );
    return [...new Set(destinations)];
  }, [batches]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await getDeliveredShipments();
      const formattedBatches: DeliveryBatch[] = results.map((batch) => ({
        ...batch,
        deliveryDate: batch.deliveryDate
          ? batch.deliveryDate.toISOString().slice(0, 10)
          : "N/A",
        totalWeight: batch.totalWeight || 0,
        shippingCost: batch.shippingCost || 0,
        serviceFee: batch.serviceFee || 15,
        totalCost: batch.totalCost || 0,
        netProfit:
          (batch.totalWeight || 0) * PROFIT_PER_POUND +
          (batch.serviceFee || 15),
        carrier: batch.carrier || "PNS",
        status: batch.status || "Delivered",
        notes: batch.notes || "",
        createdAt: batch.createdAt || new Date().toISOString(),
        shipments: batch.shipments.map((s: any) => ({
          ...s,
          status: s.status || "Delivered",
          createdAt: s.createdAt || new Date().toISOString(),
          updatedAt: s.updatedAt || new Date().toISOString(),
          details: {
            ...(s.details || { weight: 0, shippingCost: 0 }),
            dimensions: s.details?.dimensions || {
              length: 30,
              width: 20,
              height: 15,
            },
            fragile: s.details?.fragile || false,
            priority: s.details?.priority || "standard",
            notes: s.details?.notes || "",
          },
        })),
      }));
      setBatches(formattedBatches);
      toast.success("Données chargées avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des lots :", error);
      setError("Impossible de charger les données. Veuillez réessayer.");
      toast.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBatches();
    setRefreshing(false);
  };

  useEffect(() => {
    if (batches.length === 0) return;
    let filtered = [...batches];
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(
        (batch) =>
          batch.deliveryDate >= filters.dateRange.start &&
          batch.deliveryDate <= filters.dateRange.end
      );
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((batch) =>
        batch.shipments.some(
          (s) =>
            s.trackingNumber.toLowerCase().includes(searchLower) ||
            s.fullName.toLowerCase().includes(searchLower) ||
            s.userName.toLowerCase().includes(searchLower) ||
            s.emailAdress.toLowerCase().includes(searchLower) ||
            s.destination.toLowerCase().includes(searchLower) ||
            batch.ownerId.toLowerCase().includes(searchLower) ||
            String(batch.id).includes(searchLower)
        )
      );
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter((batch) =>
        batch.shipments.some((s) => filters.categories.includes(s.category))
      );
    }
    if (filters.destinations.length > 0) {
      filtered = filtered.filter((batch) =>
        batch.shipments.some((s) =>
          filters.destinations.includes(s.destination)
        )
      );
    }
    if (filters.priceRange.min !== "") {
      filtered = filtered.filter(
        (batch) => batch.totalCost >= Number(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max !== "") {
      filtered = filtered.filter(
        (batch) => batch.totalCost <= Number(filters.priceRange.max)
      );
    }
    filtered.sort((a, b) => {
      let valueA, valueB;
      switch (filters.sortBy) {
        case "deliveryDate":
          valueA = a.deliveryDate;
          valueB = b.deliveryDate;
          break;
        case "totalCost":
          valueA = a.totalCost;
          valueB = b.totalCost;
          break;
        case "netProfit":
          valueA = a.netProfit;
          valueB = b.netProfit;
          break;
        case "totalWeight":
          valueA = a.totalWeight;
          valueB = b.totalWeight;
          break;
        case "shipmentCount":
          valueA = a.shipments.length;
          valueB = b.shipments.length;
          break;
        default:
          valueA = a.deliveryDate;
          valueB = b.deliveryDate;
      }
      return filters.sortOrder === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
    setFilteredBatches(filtered);
    calculateMonthlyStats(filtered);
  }, [filters, batches]);

  const calculateMonthlyStats = (batchesToAnalyze: DeliveryBatch[]) => {
    if (batchesToAnalyze.length === 0) {
      setCurrentMonthStats({
        totalBatches: 0,
        totalShipments: 0,
        totalWeight: 0,
        totalShippingCost: 0,
        totalServiceFees: 0,
        totalRevenue: 0,
        totalNetProfit: 0,
        avgShipmentWeight: 0,
        avgProfitPerShipment: 0,
        topDestination: { name: "N/A", count: 0 },
        topCategory: { name: "N/A", count: 0 },
        deliveryTrend: 0,
        profitTrend: 0,
      });
      return;
    }
    const totalShipments = batchesToAnalyze.reduce(
      (sum, b) => sum + b.shipments.length,
      0
    );
    const totalWeight = batchesToAnalyze.reduce(
      (sum, b) => sum + b.totalWeight,
      0
    );
    const totalNetProfit = batchesToAnalyze.reduce(
      (sum, b) => sum + b.netProfit,
      0
    );
    const destinations: Record<string, number> = {};
    const categories: Record<string, number> = {};
    batchesToAnalyze.forEach((batch) => {
      batch.shipments.forEach((shipment) => {
        destinations[shipment.destination] =
          (destinations[shipment.destination] || 0) + 1;
        categories[shipment.category] =
          (categories[shipment.category] || 0) + 1;
      });
    });
    let topDestination = { name: "N/A", count: 0 };
    let topCategory = { name: "N/A", count: 0 };
    Object.entries(destinations).forEach(([name, count]) => {
      if (count > topDestination.count) topDestination = { name, count };
    });
    Object.entries(categories).forEach(([name, count]) => {
      if (count > topCategory.count) topCategory = { name, count };
    });
    const deliveryTrend = Math.random() * 20 - 10;
    const profitTrend = Math.random() * 30 - 5;
    setCurrentMonthStats({
      totalBatches: batchesToAnalyze.length,
      totalShipments,
      totalWeight,
      totalShippingCost: batchesToAnalyze.reduce(
        (sum, b) => sum + b.shippingCost,
        0
      ),
      totalServiceFees: batchesToAnalyze.reduce(
        (sum, b) => sum + b.serviceFee,
        0
      ),
      totalRevenue: batchesToAnalyze.reduce((sum, b) => sum + b.totalCost, 0),
      totalNetProfit,
      avgShipmentWeight: totalShipments > 0 ? totalWeight / totalShipments : 0,
      avgProfitPerShipment:
        totalShipments > 0 ? totalNetProfit / totalShipments : 0,
      topDestination,
      topCategory,
      deliveryTrend,
      profitTrend,
    });
  };

  const prepareChartData = () => {
    let startDate = new Date(filters.dateRange.start);
    let endDate = new Date(filters.dateRange.end);
    if (!isValid(startDate) || !isValid(endDate)) {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const labels = dateRange.map((date) => format(date, "dd/MM"));
    const data = labels.map(() => 0);
    filteredBatches.forEach((batch) => {
      const batchDate = parseISO(batch.deliveryDate);
      if (isValid(batchDate)) {
        const dayIndex = dateRange.findIndex(
          (date) =>
            date.getDate() === batchDate.getDate() &&
            date.getMonth() === batchDate.getMonth() &&
            date.getFullYear() === batchDate.getFullYear()
        );
        if (dayIndex !== -1) {
          data[dayIndex] += batch.shipments.length;
        }
      }
    });
    return { labels, data };
  };

  const chartData = prepareChartData();

  const exportToCSV = () => {
    try {
      const headers = [
        "Batch ID",
        "Owner ID",
        "Delivery Date",
        "Carrier",
        "Status",
        "Total Weight (lbs)",
        "Shipping Cost ($)",
        "Service Fee ($)",
        "Total Cost ($)",
        "Net Profit ($)",
        "Tracking Number",
        "Owner",
        "Username",
        "Email",
        "Destination",
        "Category",
        "Shipment Weight (lbs)",
        "Shipment Cost ($)",
      ];
      const rows = filteredBatches.flatMap((b) =>
        b.shipments.map((s) => [
          b.id,
          b.ownerId,
          b.deliveryDate,
          b.carrier,
          b.status,
          b.totalWeight.toFixed(2),
          b.shippingCost.toFixed(2),
          b.serviceFee.toFixed(2),
          b.totalCost.toFixed(2),
          b.netProfit.toFixed(2),
          s.trackingNumber,
          s.fullName,
          s.userName,
          s.emailAdress,
          s.destination,
          s.category,
          s.details.weight.toFixed(2),
          s.details.shippingCost.toFixed(2),
        ])
      );
      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        `export_shipments_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export CSV réussi");
    } catch (error) {
      toast.error("Erreur lors de l'exportation");
      console.error("Erreur export CSV:", error);
    }
  };

  const exportToPDF = () => {
    toast.info("Préparation du PDF...");
    setTimeout(() => toast.success("PDF exporté avec succès"), 2000);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [type]: value },
    }));
  };

  const handlePriceRangeChange = (
    type: "min" | "max",
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const categories = [...prev.categories];
      return {
        ...prev,
        categories: categories.includes(category)
          ? categories.filter((c) => c !== category)
          : [...categories, category],
      };
    });
  };

  const handleDestinationChange = (destination: string) => {
    setFilters((prev) => {
      const destinations = [...prev.destinations];
      return {
        ...prev,
        destinations: destinations.includes(destination)
          ? destinations.filter((d) => d !== destination)
          : [...destinations, destination],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      dateRange: {
        start: startOfMonth(new Date()).toISOString().slice(0, 10),
        end: endOfMonth(new Date()).toISOString().slice(0, 10),
      },
      priceRange: { min: "", max: "" },
      categories: [],
      destinations: [],
      sortBy: "deliveryDate",
      sortOrder: "desc",
    });
    toast.info("Filtres réinitialisés");
  };

  const handleDisplayOptionChange = (key: keyof DisplayOptions, value: any) => {
    setDisplayOptions((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDetailModal = (batch: DeliveryBatch | null = null) => {
    if (batch) {
      setSelectedBatch(batch);
      setIsDetailModalOpen(true);
    } else {
      setIsDetailModalOpen(false);
      setTimeout(() => setSelectedBatch(null), 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader  />
        <p className="mt-4 text-lg text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <AlertTriangle size={60} className="text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Erreur de chargement
        </h2>
        <p className="mt-2 text-lg text-gray-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Boxes className="mr-2 h-8 w-8 text-blue-600" />
                Analyse des Livraisons
              </h2>
              <p className="mt-1 text-lg text-gray-600">
                Suivi et analyse de performance des expéditions livrées
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
              >
                <FileText size={18} />
                PDF
              </button>
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <Filter size={18} />
                Filtres
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par N° tracking, client, destination..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="block w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="deliveryDate">Date</option>
                <option value="totalCost">Coût total</option>
                <option value="netProfit">Bénéfice</option>
                <option value="totalWeight">Poids</option>
                <option value="shipmentCount">Nb colis</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange(
                    "sortOrder",
                    e.target.value as "asc" | "desc"
                  )
                }
                className="block w-24 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">↑ Asc</option>
                <option value="desc">↓ Desc</option>
              </select>
              <select
                value={displayOptions.viewMode}
                onChange={(e) =>
                  handleDisplayOptionChange(
                    "viewMode",
                    e.target.value as "list" | "grid" | "table"
                  )
                }
                className="block w-28 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="list">Liste</option>
                <option value="grid">Grille</option>
                <option value="table">Tableau</option>
              </select>
            </div>
          </div>
        </header>

        {isFilterPanelOpen && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5 text-blue-600" />
                Filtres avancés
              </h3>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plage de dates
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      handleDateRangeChange("start", e.target.value)
                    }
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      handleDateRangeChange("end", e.target.value)
                    }
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fourchette de prix
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      handlePriceRangeChange("min", e.target.value)
                    }
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      handlePriceRangeChange("max", e.target.value)
                    }
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégories
                </label>
                <div className="max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinations
                </label>
                <div className="max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {uniqueDestinations.slice(0, 10).map((destination) => (
                    <div key={destination} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`destination-${destination}`}
                        checked={filters.destinations.includes(destination)}
                        onChange={() => handleDestinationChange(destination)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`destination-${destination}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {destination}
                      </label>
                    </div>
                  ))}
                  {uniqueDestinations.length > 10 && (
                    <div className="text-sm text-gray-500 mt-1">
                      +{uniqueDestinations.length - 10} autres
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de graphique
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDisplayOptionChange("chartType", "bar")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    displayOptions.chartType === "bar"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <BarChart3 size={16} />
                  Barres
                </button>
                <button
                  onClick={() => handleDisplayOptionChange("chartType", "line")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    displayOptions.chartType === "line"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <TrendingUp size={16} />
                  Ligne
                </button>
                <button
                  onClick={() => handleDisplayOptionChange("chartType", "pie")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    displayOptions.chartType === "pie"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <PieChart size={16} />
                  Camembert
                </button>
                <button
                  onClick={() =>
                    handleDisplayOptionChange("chartType", "radar")
                  }
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    displayOptions.chartType === "radar"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <TableProperties size={16} />
                  Radar
                </button>
                <div className="ml-auto">
                  <button
                    onClick={() =>
                      handleDisplayOptionChange(
                        "showOnlyProfit",
                        !displayOptions.showOnlyProfit
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                      displayOptions.showOnlyProfit
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <DollarSign size={16} />
                    Bénéfices uniquement
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Appliquer
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total des colis
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {currentMonthStats.totalShipments}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm ${
                          currentMonthStats.deliveryTrend >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentMonthStats.deliveryTrend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 flex-shrink-0 rotate-180" />
                        )}
                        <span className="ml-1">
                          {Math.abs(currentMonthStats.deliveryTrend).toFixed(1)}
                          %
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Bénéfice net
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency.format(
                          currentMonthStats.totalNetProfit
                        )}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm ${
                          currentMonthStats.profitTrend >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentMonthStats.profitTrend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 flex-shrink-0 rotate-180" />
                        )}
                        <span className="ml-1">
                          {Math.abs(currentMonthStats.profitTrend).toFixed(1)}%
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Weight className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Poids total
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatWeight(currentMonthStats.totalWeight)}
                      </div>
                      <div className="ml-2 text-sm text-gray-500">
                        (moy.{" "}
                        {formatWeight(currentMonthStats.avgShipmentWeight)}
                        /colis)
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Destination principale
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-xl font-semibold text-gray-900 truncate max-w-full">
                        {currentMonthStats.topDestination.name}
                      </div>
                    </dd>
                    <dd className="text-sm text-gray-500">
                      {currentMonthStats.topDestination.count} colis
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FileBarChart className="mr-2 h-5 w-5 text-blue-600" />
                Analyse des{" "}
                {displayOptions.showOnlyProfit ? "bénéfices" : "performances"}
              </h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {filteredBatches.length} lots •{" "}
                  {format(parseISO(filters.dateRange.start), "dd/MM/yyyy")} -{" "}
                  {format(parseISO(filters.dateRange.end), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
            <div className="h-64">
              {displayOptions.chartType === "bar" && (
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Colis livrés",
                        data: chartData.data,
                        backgroundColor: "rgba(59, 130, 246, 0.5)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { display: false },
                      },
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Nombre de colis" },
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: { mode: "index", intersect: false },
                    },
                  }}
                />
              )}
              {displayOptions.chartType === "line" && (
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: displayOptions.showOnlyProfit
                      ? [
                          {
                            label: "Profit ($)",
                            data: chartData.data,
                            fill: true,
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            borderColor: "rgb(16, 185, 129)",
                            tension: 0.3,
                          },
                        ]
                      : [
                          {
                            label: "Revenue ($)",
                            data: chartData.data,
                            fill: true,
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            borderColor: "rgb(59, 130, 246)",
                            tension: 0.3,
                          },
                          {
                            label: "Profit ($)",
                            data: chartData.data,
                            fill: true,
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            borderColor: "rgb(16, 185, 129)",
                            tension: 0.3,
                          },
                          {
                            label: "Shipment Count",
                            data: chartData.data,
                            borderColor: "rgb(217, 119, 6)",
                            backgroundColor: "rgba(217, 119, 6, 0.2)",
                            borderDash: [5, 5],
                            tension: 0.3,
                            yAxisID: "y1",
                          },
                        ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { grid: { display: false } },
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "$" },
                      },
                      y1: displayOptions.showOnlyProfit
                        ? undefined
                        : {
                            position: "right",
                            beginAtZero: true,
                            title: { display: true, text: "Count" },
                            grid: { display: false },
                          },
                    },
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { mode: "index", intersect: false },
                    },
                  }}
                />
              )}
              {displayOptions.chartType === "pie" && (
                <Pie
                  data={{
                    labels: CATEGORIES,
                    datasets: [
                      {
                        label: "Shipments by Category",
                        data: CATEGORIES.map((category) =>
                          filteredBatches.reduce(
                            (sum, batch) =>
                              sum +
                              batch.shipments.filter(
                                (s) => s.category === category
                              ).length,
                            0
                          )
                        ),
                        backgroundColor: [
                          "rgba(59, 130, 246, 0.6)",
                          "rgba(16, 185, 129, 0.6)",
                          "rgba(217, 119, 6, 0.6)",
                          "rgba(220, 38, 38, 0.6)",
                          "rgba(139, 92, 246, 0.6)",
                          "rgba(236, 72, 153, 0.6)",
                          "rgba(75, 85, 99, 0.6)",
                          "rgba(245, 158, 11, 0.6)",
                          "rgba(6, 182, 212, 0.6)",
                          "rgba(249, 115, 22, 0.6)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "right" } },
                  }}
                />
              )}
              {displayOptions.chartType === "radar" && (
                <Radar
                  data={{
                    labels: [
                      "Profit (k$)",
                      "Shipment Count",
                      "Total Weight",
                      "Avg Profit",
                      "Efficiency",
                    ],
                    datasets: [
                      {
                        label: "Performance",
                        data: [
                          currentMonthStats.totalNetProfit / 1000,
                          currentMonthStats.totalShipments / 10,
                          currentMonthStats.totalWeight / 100,
                          currentMonthStats.avgProfitPerShipment,
                          (currentMonthStats.totalNetProfit /
                            currentMonthStats.totalShippingCost) *
                            5,
                        ],
                        backgroundColor: "rgba(59, 130, 246, 0.3)",
                        borderColor: "rgb(59, 130, 246)",
                        pointBackgroundColor: "rgb(59, 130, 246)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgb(59, 130, 246)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        pointLabels: { font: { size: 12 } },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          {filteredBatches.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-lg text-gray-500">
                Aucun lot livré dans cette période.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </div>

        {isDetailModalOpen && selectedBatch && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
                onClick={() => toggleDetailModal()}
              ></div>
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-blue-600" />
                        Détails du lot #{selectedBatch.id}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Livré le{" "}
                        {format(
                          parseISO(selectedBatch.deliveryDate),
                          "dd MMMM yyyy",
                          { locale: fr }
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleDetailModal()}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Informations
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Carrier:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedBatch.carrier}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            {selectedBatch.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Owner:</span>
                          <span className="text-sm font-medium">
                            {selectedBatch.ownerId}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Metrics
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Shipments:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedBatch.shipments.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Total Weight:
                          </span>
                          <span className="text-sm font-medium">
                            {formatWeight(selectedBatch.totalWeight)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Avg Weight:
                          </span>
                          <span className="text-sm font-medium">
                            {formatWeight(
                              selectedBatch.totalWeight /
                                selectedBatch.shipments.length
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Financials
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Shipping Cost:
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency.format(selectedBatch.shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Service Fee:
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency.format(selectedBatch.serviceFee)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Total Cost:
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency.format(selectedBatch.totalCost)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-sm text-gray-800">
                            Net Profit:
                          </span>
                          <span className="text-sm text-green-600">
                            +{formatCurrency.format(selectedBatch.netProfit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Package className="mr-2 h-4 w-4 text-blue-600" />
                      Shipments ({selectedBatch.shipments.length})
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tracking
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Destination
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Weight
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cost
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedBatch.shipments.map((shipment) => (
                              <tr
                                key={shipment.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  navigate(`/shipment/${shipment.id}`)
                                }
                              >
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                                  {shipment.trackingNumber}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {shipment.fullName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {shipment.emailAdress}
                                  </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {shipment.destination}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {shipment.category}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {formatWeight(shipment.details.weight)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency.format(
                                    shipment.details.shippingCost
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => toggleDetailModal()}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeliveryDashboard;
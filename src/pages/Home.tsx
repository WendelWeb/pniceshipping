import { motion } from 'framer-motion';
import HeroSection from "../components/HeroSection";
import ParcelTracker from "../components/ParcelTrackerComponent";
import {
  Mail,
  Package,
  DollarSign,
  Scale,
  Ban,
  Smartphone,
  Eye,
  CheckCircle,
  MessageCircle,
  ArrowUpRight,
  Send,
  Shield,
  Users,
  Globe,
  Zap,
  Award,
  Star,
  TrendingUp
} from "lucide-react";
import ShippingGuide from "@/components/ShippingGuide";
import Pricing from "./Pricing";
import GetAQuote from "@/components/GetAQuote";
import ShippingModel from "@/components/ShippingModel";
import HaitiShippingInfo from "@/components/HaitiShippingInfo";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { useSettings } from "@/contexts/SettingsContext";

const services = [
  {
    title: "Expedition Express",
    description:
      "Dans notre monde moderne où tout va vite, chacun désire une action immédiate. Les gens s'attendent à tout recevoir rapidement. Livraison en 3 à 6 jours.",
    icon: "🚚",
  },
  {
    title: "Livraison Personnalisée",
    description:
      "Nous offrons un service de livraison adapté à vos besoins spécifiques. Choisissez l'heure et l'endroit qui vous conviennent le mieux.",
    icon: "📦",
  },
  {
    title: "100% de Satisfaction",
    description:
      "Notre priorité est votre satisfaction. Nous nous engageons à fournir un service de qualité et à répondre à toutes vos attentes.",
    icon: "✅",
  },
];

const features = [
  {
    number: "1",
    title: "Couverture Personnalisée",
    description:
      "Protégez votre plus grand investissement avec nos polices d'assurance habitation complètes.",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    number: "2",
    title: "Service Client Exceptionnel",
    description:
      "Notre équipe de service client dévouée est toujours prête à vous aider.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    number: "3",
    title: "Expertise Reconnue",
    description:
      "Avec des années d'expérience dans l'industrie, notre équipe de professionnels.",
    icon: <Award className="w-6 h-6" />,
  },
  {
    number: "4",
    title: "Partenariats Solides",
    description:
      "Nous croyons en la conduite de nos affaires avec transparence et intégrité.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

// Conditions générales d'expédition (à rendre dynamique dans le composant)
const getShippingTerms = (shippingRates: any, specialItems: any) => [
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Tarification",
    items: [
      `Frais de service : ${shippingRates.serviceFee} $`,
      `Cap-Haïtien : ${shippingRates.rateCapHaitien} $/lbs`,
      `Port-au-Prince : ${shippingRates.ratePortAuPrince} $/lbs`,
      ...specialItems.items
        .filter((item: any) => item.price > 0)
        .map((item: any) => `${item.name} : ${item.price} $`)
    ],
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Limites de Poids",
    items: [
      "Maximum 40 livres (lbs) par colis",
      "Colis plus lourds doivent être divisés",
      "Service de dispatch disponible"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Ban className="w-8 h-8" />,
    title: "Articles Réglementés",
    items: [
      "Produits pharmaceutiques : accord préalable requis",
      "Produits aromatiques : expédiés une fois par semaine",
      "Articles non autorisés = fraude, aucun remboursement"
    ],
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Suivi et Gestion",
    items: [
      "Suivi complet sur pniceshipping.com",
      "Requête de colis disponible",
      "Contact WhatsApp direct",
      "Support client réactif"
    ],
    gradient: "from-purple-500 to-violet-500"
  }
];

const bestPractices = [
  {
    icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
    text: "Vérifiez le poids et le contenu avant envoi",
    emoji: "✅"
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
    text: "Informez-nous pour les articles de valeur",
    emoji: "💎"
  },
  {
    icon: <Package className="w-6 h-6 text-orange-400" />,
    text: "Utilisez votre compte client pour le suivi",
    emoji: "📱"
  },
  {
    icon: <Smartphone className="w-6 h-6 text-purple-400" />,
    text: "Contactez-nous en cas de doute",
    emoji: "💬"
  }
];

const testimonials = [
  {
    name: "Marie Dubois",
    username: "@mdubois_shop",
    role: "Pharmacienne",
    avatar: "/testimony-1.png",
    message:
      "Le service de coursier médical est exceptionnel. La livraison de médicaments urgents nécessite une précision et une rapidité sans faille. Leur équipe comprend parfaitement ces enjeux et assure une livraison sécurisée dans des délais très courts.",
    rating: 5,
  },
  {
    name: "Thomas Laurent",
    username: "@tlaurent_tech",
    role: "Informaticien",
    avatar: "/testimony-3.png",
    message:
      "Je commande souvent des produits high-tech en ligne, et la rapidité de livraison est essentielle pour moi. Pnice assure un suivi précis et des délais toujours respectés, ce qui me permet d'acheter en toute confiance.",
    rating: 5,
  },
  {
    name: "Sophie Martin",
    username: "@smartin_fashion",
    role: "Passionnée de mode",
    avatar: "/testimony-2.png",
    message:
      "Acheter des vêtements en ligne peut être stressant quand on craint les retards de livraison. Avec Pnice, mes commandes arrivent toujours à temps et en parfait état. C'est un vrai soulagement !",
    rating: 5,
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.05, 
    transition: { duration: 0.2 } 
  },
  tap: { scale: 0.98 }
};

const glowEffect = {
  hover: {
    boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  }
};

const Home = () => {
  // Get dynamic settings
  const { shippingRates, specialItems } = useSettings();

  // Generate dynamic shipping terms
  const shippingTerms = getShippingTerms(shippingRates, specialItems);

  return (
    <div className="bg-slate-950 text-white overflow-hidden">
      <HeroSection />
      <ShippingModel />
      <ParcelTracker />
      <HaitiShippingInfo />
      <GetAQuote />

      {/* Services Section */}
      <ServiceCard services={services} />
      
      {/* Nouvelle section Conditions Générales d'Expédition */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden" 
        id="conditions"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl">✈️</span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6"
              variants={fadeInUp}
            >
              Conditions Générales d'Expédition 🚀
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Chez Pnice Shipping, nous nous engageons à vous offrir un service rapide, sécurisé et transparent pour l'expédition de vos colis vers Haïti. ✨
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16"
            variants={staggerContainer}
          >
            {shippingTerms.map((term, index) => (
              <motion.div 
                key={index} 
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ ...scaleOnHover.hover, ...glowEffect.hover }}
                whileTap={scaleOnHover.tap}
              >
                <div className="flex items-center mb-6">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${term.gradient} flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {term.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white ml-4">{term.title}</h3>
                </div>
                <ul className="space-y-3">
                  {term.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex} 
                      className="text-slate-300 flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * itemIndex }}
                    >
                      <motion.span 
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${term.gradient} mt-2 mr-4 flex-shrink-0`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Bonnes pratiques */}
          <motion.div 
            className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-slate-700/30"
            variants={fadeInUp}
            whileHover={glowEffect.hover}
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              ✅ Bonnes Pratiques à Respecter
            </motion.h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              variants={staggerContainer}
            >
              {bestPractices.map((practice, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.span 
                    className="text-2xl mr-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {practice.emoji}
                  </motion.span>
                  {practice.icon}
                  <span className="ml-4 text-slate-200 font-medium">{practice.text}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <p className="text-slate-300 mb-6 text-lg">
                <strong>Nous sommes là pour vous accompagner et garantir une expérience fluide. 🤝</strong>
              </p>
              <motion.div 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                    "0 0 30px rgba(16, 185, 129, 0.5)",
                    "0 0 20px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.span 
                  className="mr-3 text-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  💬
                </motion.span>
                <span className="font-semibold">Contactez-nous dès qu'un doute survient : mieux vaut prévenir que guérir !</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp}>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Optimiser l'Efficacité de la 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Logistique Mondiale 🌍</span>
            </motion.h2>
            <motion.p 
              className="text-slate-300 text-lg mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Chez Pnice shipping, nous nous engageons à fournir des services de courrier et de colis rapides, fiables et sécurisés. Avec un accent sur la satisfaction client et l'efficacité, nous garantissons chaque livraison. ⚡
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
              variants={staggerContainer}
            >
              <motion.div 
                className="flex items-center space-x-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <motion.span 
                  className="text-4xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👁️
                </motion.span>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">Notre Vision</h3>
                  <p className="text-slate-400">
                    Devenir le leader des services de courrier et de colis. 🚀
                  </p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <motion.span 
                  className="text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🎯
                </motion.span>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">Notre Mission</h3>
                  <p className="text-slate-400">
                    Assurer des livraisons rapides et fiables dans le monde entier. 🌟
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.button 
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              variants={fadeInUp}
            >
              <span>En Savoir Plus</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>✨</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="./about.jpg"
                alt="Service de livraison"
                className="w-full h-auto rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl"></div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-gradient-to-br from-slate-800 to-slate-700 text-white p-8 rounded-3xl shadow-2xl border border-slate-600/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 50, x: -50 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <motion.h3 
                    className="text-3xl font-bold text-emerald-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    100%
                  </motion.h3>
                  <p className="text-sm text-slate-300">Expéditions réussies 🎯</p>
                </div>
                <div className="w-px h-12 bg-slate-600"></div>
                <div className="text-center">
                  <motion.h3 
                    className="text-3xl font-bold text-blue-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    50+
                  </motion.h3>
                  <p className="text-sm text-slate-300">Entreprises Accompagnées 🏢</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="py-20 px-6 bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp}>
            <motion.p 
              className="text-yellow-400 font-bold text-lg mb-4 flex items-center"
              variants={fadeInUp}
            >
              <Star className="w-5 h-5 mr-2" />
              Pourquoi Nous Choisir
            </motion.p>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
              variants={fadeInUp}
            >
              Vivez la Meilleure Expérience de Service 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Avec Nous 🌟</span>
            </motion.h2>
            <motion.p 
              className="text-slate-300 text-lg mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Choisissez-nous pour notre fiabilité éprouvée, notre disponibilité 24/7 et notre engagement envers la satisfaction client. Nous priorisons les livraisons rapides et sécurisées et offrons un suivi en temps réel pour vous tenir informé à chaque étape. ⚡
            </motion.p>
            
            <motion.div 
              className="md:hidden mb-8"
              variants={fadeInUp}
            >
              <motion.img 
                src="/customer-service.png" 
                alt="Service client premium" 
                className="w-full h-auto rounded-2xl shadow-xl"
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>
            
            <motion.a href="#calculator" variants={fadeInUp}>
              <motion.button 
                className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                <span>Obtenir un Devis</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </motion.a>
          </motion.div>

          <motion.div 
            className="hidden lg:block"
            variants={fadeInUp}
          >
            <motion.img 
              src="/customer-service.png" 
              alt="Service client premium" 
              className="w-full h-auto rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.div 
            className="lg:col-span-2 mt-16"
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-start bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div 
                    className="flex items-center mb-6"
                    whileHover={{ x: 5 }}
                  >
                    <motion.span 
                      className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mr-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {feature.number}
                    </motion.span>
                    <motion.div 
                      className="text-blue-400"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                  <h3 className="font-bold text-xl text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Pricing />

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-white text-4xl md:text-5xl font-bold text-center mb-4"
            variants={fadeInUp}
          >
            Ce Que Disent Nos Clients 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">✨</span>
          </motion.h2>
          
          <motion.p 
            className="text-slate-300 text-center text-lg mb-16"
            variants={fadeInUp}
          >
            Découvrez pourquoi nos clients nous font confiance pour leurs expéditions 🚀
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl shadow-2xl p-8 rounded-3xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl shadow-lg border-2 border-slate-600"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <div>
                    <h3 className="font-bold text-xl text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {testimonial.username}
                    </p>
                  </div>
                </div>

                <motion.div 
                  className="flex mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        duration: 0.5, 
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.message}"
                </p>

                <div className="flex space-x-3">
                  <motion.span 
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm px-4 py-2 rounded-full border border-blue-500/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    {testimonial.role} 👤
                  </motion.span>
                  <motion.span 
                    className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 text-sm px-4 py-2 rounded-full border border-emerald-500/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    ⭐ Vérifié
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <ShippingGuide />

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 py-20 px-6 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div variants={fadeInUp}>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Faites le Premier Pas Vers 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Votre Vision 🚀</span>
            </motion.h1>
            <motion.p 
              className="text-slate-300 mb-10 text-xl leading-relaxed"
              variants={fadeInUp}
            >
              Notre équipe expérimentée de professionnels est dédiée à transformer votre vision en réalité. Rejoignez des milliers de clients satisfaits ! ✨
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              variants={staggerContainer}
            >
              <motion.a
                className="group"
                href="#calculator"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold text-lg">Obtenir un Devis</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.a>
              <motion.a
                className="group"
                href="#services"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 hover:border-slate-500 shadow-xl">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold text-lg">Nos services</span>
                  <span>📦</span>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="./worker.png"
                alt="Équipe de Construction"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl"></div>
              <motion.div 
                className="absolute top-4 right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-xl">🏆</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-2xl font-bold text-white mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="w-8 h-8 mr-3 text-blue-400" />
              Pnice Shipping 🌍
            </motion.h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Découvrez notre engagement envers l'excellence dans le transport et la logistique. Nous connectons le monde, un colis à la fois. ✈️
            </p>
            <motion.div 
              className="flex flex-col gap-4"
              variants={staggerContainer}
            >
              <motion.a 
                href="https://api.whatsapp.com/send/?phone=50931970548&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                title="Contactez-nous sur WhatsApp"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="mr-2 text-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💬
                </motion.span>
                Aide WhatsApp
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=user_system_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                title="Suivez-nous sur Instagram"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="mr-2 text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  📸
                </motion.span>
                Suivre Instagram
              </motion.a>
              <motion.div 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="mr-2 text-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  🌐
                </motion.span>
                Site Web
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-2xl font-bold text-white mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <MessageCircle className="w-8 h-8 mr-3 text-purple-400" />
              Informations de Contact 📞
            </motion.h2>
            <div className="space-y-3 text-slate-300">
              <motion.p 
                className="flex items-center justify-center"
                whileHover={{ x: 5 }}
              >
                <span className="mr-2">📍</span>
                8298 Northwest 68th Street Miami Fl, 33195
              </motion.p>
              <motion.p 
                className="flex items-center justify-center"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-4 h-4 mr-2" />
                pniceshipping@gmail.com
              </motion.p>
              <motion.p 
                className="flex items-center justify-center"
                whileHover={{ x: 5 }}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                +509 31 97 0548
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-2xl font-bold text-white mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Send className="w-8 h-8 mr-3 text-yellow-400" />
              Newsletter 📬
            </motion.h2>
            <p className="text-slate-300 mb-6">
              Restez informé avec Pnice en vous abonnant à notre newsletter. Recevez les dernières nouvelles et offres spéciales ! ✨
            </p>
            <motion.div 
              className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-3 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <Mail className="text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Adresse Email"
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-slate-400"
              />
              <motion.button 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default Home;
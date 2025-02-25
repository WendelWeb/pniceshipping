import HeroSection from "../components/HeroSection";
import ParcelTracker from "../components/ParcelTrackerComponent";
import { Mail } from "lucide-react";
import Button from "../components/Button";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import UserList from "./UserList";
import ShippingGuide from "@/components/ShippingGuide";
import Pricing from "./Pricing";
import GetAQuote from "@/components/GetAQuote";

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
  },
  {
    number: "2",
    title: "Service Client Exceptionnel",
    description:
      "Notre équipe de service client dévouée est toujours prête à vous aider.",
  },
  {
    number: "3",
    title: "Expertise Reconnue",
    description:
      "Avec des années d'expérience dans l'industrie, notre équipe de professionnels.",
  },
  {
    number: "4",
    title: "Partenariats Solides",
    description:
      "Nous croyons en la conduite de nos affaires avec transparence et intégrité.",
  },
];

// ... [Code précédent inchangé jusqu'à testimonials]

const testimonials = [
  {
    name: "Marie Dubois",
    username: "@mdubois_shop",
    role: "Pharmacienne",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    message:
      "Le service de coursier médical est exceptionnel. La livraison de médicaments urgents nécessite une précision et une rapidité sans faille. Leur équipe comprend parfaitement ces enjeux et assure une livraison sécurisée dans des délais très courts.",
  },
  {
    name: "Thomas Laurent",
    username: "@tlaurent_tech",
    role: "Informaticien",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message:
      "Je commande souvent des produits high-tech en ligne, et la rapidité de livraison est essentielle pour moi. Pnice assure un suivi précis et des délais toujours respectés, ce qui me permet d’acheter en toute confiance.",
  },
  {
    name: "Sophie Martin",
    username: "@smartin_fashion",
    role: "Passionnée de mode",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    message:
      "Acheter des vêtements en ligne peut être stressant quand on craint les retards de livraison. Avec Pnice, mes commandes arrivent toujours à temps et en parfait état. C'est un vrai soulagement !",
  },
];

// ... [Reste du code inchangé]

const Home = () => {
  return (
    <div className="">
      <HeroSection />
      <ParcelTracker />
      <GetAQuote />
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Nous Sommes Reconnus pour Nos Services
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" id="services">
            {services.map((service, i) => (
              <div
                key={i}
                className="p-6 bg-white shadow-lg rounded-2xl flex flex-col"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-gray-500 mt-2">{service.description}</p>
                <button className="text-blue-600 mt-4 flex items-center cursor-pointer">
                  En savoir plus <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Optimiser l'Efficacité de la Logistique Mondiale
            </h2>
            <p className="text-gray-600 mt-4">
              Chez Pnice shipping, nous nous engageons à fournir des services de
              courrier et de colis rapides, fiables et sécurisés. Avec un accent
              sur la satisfaction client et l'efficacité, nous garantissons
              chaque livraison.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">👁️</span>
                <div>
                  <h3 className="font-semibold text-lg">Notre Vision</h3>
                  <p className="text-gray-500 text-sm">
                    Devenir le leader des services de courrier et de colis.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-lg">Notre Mission</h3>
                  <p className="text-gray-500 text-sm">
                    Assurer des livraisons rapides et fiables dans le monde
                    entier.
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition">
              <span>En Savoir Plus</span>
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="relative">
            <img
              src="./about.png"
              alt="Service de livraison"
              className="rounded-xl shadow-lg"
            />
            <div className="absolute bottom-0 left-8 bg-blue-600 text-white p-4 rounded-xl">
              <div className="flex items-center space-x-6">
                <div>
                  <h3 className="text-2xl font-bold">100%</h3>
                  <p className="text-sm">Expéditions réussies</p>
                </div>
                <div className="border-l border-white h-10"></div>
                <div>
                  <h3 className="text-2xl font-bold">50+</h3>
                  <p className="text-sm">Entreprises Accompagnées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-yellow-500 font-semibold">
              Pourquoi Nous Choisir
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Vivez la Meilleure Expérience de Service Avec Nous
            </h2>
            <p className="text-gray-600 mt-4">
              Choisissez-nous pour notre fiabilité éprouvée, notre disponibilité
              24/7 et notre engagement envers la satisfaction client. Nous
              priorisons les livraisons rapides et sécurisées et offrons un
              suivi en temps réel pour vous tenir informé à chaque étape.
            </p>
            <a href="#calculator" >
              <button className="mt-6 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition">
                <span>Obtenir un Devis</span>
                <ArrowUpRight size={18} />
              </button>
            </a>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start bg-gray-50 p-6 rounded-xl shadow-sm"
              >
                <span className="text-3xl font-bold text-blue-600">
                  {feature.number}
                </span>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Pricing />
      <section className="py-12 px-6 bg-white m">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-gray-900 text-3xl font-bold text-center">
            Ce Que Disent Nos Clients
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-6 rounded-xl border"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.username}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mt-4 text-sm">
                  {testimonial.message}
                </p>

                <div className="mt-4 flex space-x-2">
                  <span className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {testimonial.role}
                  </span>
                  <span className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                    ✕
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ShippingGuide />

      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Faites le Premier Pas Vers Votre Vision
            </h1>
            <p className="text-gray-600 mb-6">
              Notre équipe expérimentée de professionnels est dédiée à
              transformer votre vision en réalité.
            </p>
            <div className="flex gap-4">
              <a  className=" text-white px-3 py-3  rounded-md  transition-colors w-full flex items-center justify-center" href="#calculator">

              <Button text="Obtenir un Devis" />
              </a>
              <a  className=" text-white px-3 py-3 rounded-md   transition-colors w-full flex items-center justify-center" href="#services">

              <Button text="Nos services" />
              </a>
            </div>
          </div>
          <div>
            <img
              src="./workers.png"
              alt="Équipe de Construction"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pnice</h2>
            <p className="text-gray-600 mt-2">
              Découvrez notre engagement envers l'excellence dans le transport
              et la logistique.
            </p>
            <div className="flex gap-4 mt-4">
              <span className="p-2 bg-gray-200 rounded-full">🌐</span>
              <span className="p-2 bg-gray-200 rounded-full">📷</span>
              <span className="p-2 bg-gray-200 rounded-full">🎥</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Informations de Contact
            </h2>
            <p className="text-gray-600 mt-2">
              3517 W. Gary St, Utica, Pennsylvania 57867
            </p>
            <p className="text-gray-600 mt-1">pniceshipping@gmail.com</p>
            <p className="text-gray-600 mt-1">(225) 555-0119</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Newsletter</h2>
            <p className="text-gray-600 mt-2">
              Restez informé avec Pnice en vous abonnant à notre newsletter.
            </p>
            <div className="mt-4 flex items-center gap-2 border rounded-lg p-2 bg-white shadow-sm">
              <Mail className="text-gray-400" />
              <input
                type="email"
                placeholder="Adresse Email"
                style={{ border: "none", outline: "none" }}
                className="flex-1 border-none focus:ring-0"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                ↗️
              </button>
            </div>
          </div>
        </div>
      </section>

      <UserList />
    </div>
  );
};

export default Home;

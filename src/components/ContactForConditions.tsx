import React from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle,  Clock, Users, Award, Zap } from "lucide-react";

const ContactSection = () => {
  const socialLinks = [
    {
      name: "WhatsApp",
      url: "https://wa.me/50931970548",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      description: "Support instantané 24/7",
      badge: "Réponse rapide"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=user_system_sheet",
      icon: <Instagram className="w-5 h-5" />,
      color: "from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
      description: "Suivez nos actualités",
      badge: "Stories quotidiennes"
    },
  ];

  const stats = [
    { icon: <Users />, value: "5k+", label: "Clients Satisfaits" },
    { icon: <Award />, value: "100%", label: "Taux de Réussite" },
    { icon: <Zap />, value: "24/7", label: "Support Disponible" },
    { icon: <Clock />, value: "3-6j", label: "Délai de Livraison" }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-12 h-12 sm:w-20 sm:h-20 bg-blue-600 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 sm:w-32 sm:h-32 bg-purple-600 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-green-600 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-xl">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Connectons-nous
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Découvrez notre engagement envers l'excellence dans le transport et la logistique. 
            Notre équipe est disponible pour répondre à tous vos besoins.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="text-blue-600">{React.cloneElement(stat.icon, { className: "w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" })}</div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informations de Contact
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">8298 Northwest 68th Street Miami FL, 33166</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">pniceshipping@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+509 4881 26-52</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Restez informé avec Pnice en vous abonnant à notre newsletter.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Social Links */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Rejoignez Notre Communauté
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className={`relative overflow-hidden bg-gradient-to-r ${link.color} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0">
                          {React.cloneElement(link.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-bold text-base sm:text-lg truncate">{link.name}</h4>
                          <p className="text-white text-opacity-90 text-xs sm:text-sm truncate">{link.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2 flex-shrink-0">
                        <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full mb-1 sm:mb-2 backdrop-blur-sm">
                          {link.badge}
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:rotate-45 transition-transform duration-300">
                          <span className="text-white text-sm sm:text-lg">↗</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </a>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚀</div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                  Prêt à Expédier ?
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  Obtenez votre devis personnalisé en quelques clics
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="#calculator"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
                  >
                    Obtenir un Devis
                  </a>
                  <a
                    href="#services"
                    className="flex-1 border-2 border-gray-200 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 text-center text-sm sm:text-base"
                  >
                    Nos Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
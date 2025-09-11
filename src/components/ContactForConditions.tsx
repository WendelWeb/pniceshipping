import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Clock, Users, Award, Zap, Send, ArrowUpRight, Sparkles } from "lucide-react";
import style from "./ContactForConditions.module.css";
const ContactSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const socialLinks = [
    {
      name: "WhatsApp",
      url: "https://wa.me/50931970548",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-emerald-400 to-green-500",
      glow: "shadow-emerald-500/50",
      description: "Support instantané 24/7",
      badge: "Réponse rapide"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=user_system_sheet",
      icon: <Instagram className="w-6 h-6" />,
      color: "from-pink-500 via-purple-500 to-indigo-500",
      glow: "shadow-purple-500/50",
      description: "Suivez nos actualités",
      badge: "Stories quotidiennes"
    },
  ];

  const stats = [
    { icon: <Users />, value: "5k+", label: "Clients Satisfaits", color: "text-blue-600" },
    { icon: <Award />, value: "100%", label: "Taux de Réussite", color: "text-emerald-600" },
    { icon: <Zap />, value: "24/7", label: "Support Disponible", color: "text-purple-600" },
    { icon: <Clock />, value: "3-6j", label: "Délai de Livraison", color: "text-orange-600" }
  ];

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Adresse",
      value: "8298 Northwest 68th Street Miami FL, 33166",
      color: "bg-blue-500",
      lightColor: "bg-blue-50"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "pniceshipping@gmail.com",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Téléphone",
      value: "+509 31 97 0548",
      color: "bg-purple-500",
      lightColor: "bg-purple-50"
    }
  ];

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className={`${style.container} relative bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 px-4 sm:px-6 overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section with Animation */}
        <div className="text-center mb-16" style={{ animation: 'fadeIn 1s ease-out' }}>
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-2xl shadow-2xl">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Connectons-nous
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre engagement envers l'excellence dans le transport et la logistique. 
            Notre équipe est disponible pour répondre à tous vos besoins.
          </p>
        </div>

        {/* Stats Section with Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{ animation: `fadeInUp ${0.5 + index * 0.1}s ease-out` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500 ${
                  hoveredStat === index ? 'scale-110 rotate-3' : ''
                } ${stat.color} bg-opacity-10`}>
                  {React.cloneElement(stat.icon, { className: `w-8 h-8 ${stat.color}` })}
                </div>
                <div className={`text-3xl font-bold mb-2 transition-all duration-500 ${
                  hoveredStat === index ? 'scale-110' : ''
                }`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8">
                Informations de Contact
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-lg"
                    style={{ animation: `fadeInLeft ${0.5 + index * 0.15}s ease-out` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`relative flex items-center justify-center w-14 h-14 rounded-xl ${info.lightColor} group-hover:scale-110 transition-transform duration-500`}>
                        <div className={`absolute inset-0 ${info.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className={`relative ${info.color} bg-clip-text text-transparent`}>
                          {info.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{info.title}</p>
                        <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                          {info.value}
                        </p>
                      </div>
                    </div>
                    <div className={`absolute inset-0 ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" style={{ animation: 'shimmer 3s infinite' }} />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white">Newsletter</h3>
                </div>
                
                <p className="text-white/90 mb-6">
                  Restez informé avec Pnice en vous abonnant à notre newsletter.
                </p>
                
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="flex-1 relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 placeholder:text-gray-400"
                      />
                    </div>
                    <button 
                      onClick={handleSubscribe}
                      className="px-6 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
                    >
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {isSubscribed && (
                    <div className="absolute -bottom-8 left-0 text-green-300 text-sm" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                      ✓ Inscription réussie !
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Social Links */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Rejoignez Notre Communauté
              </h3>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <div className={`relative overflow-hidden bg-gradient-to-r ${link.color} p-6 rounded-3xl shadow-xl ${link.glow} hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-500 ${
                          hoveredSocial === index ? 'rotate-12 scale-110' : ''
                        }`}>
                          {link.icon}
                        </div>
                        <div className="text-white">
                          <h4 className="font-bold text-xl mb-1">{link.name}</h4>
                          <p className="text-white/90 text-sm">{link.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className="bg-white/25 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                          {link.badge}
                        </span>
                        <div className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500 ${
                          hoveredSocial === index ? 'rotate-45 scale-110' : ''
                        }`}>
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Call to Action Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4" style={{ animation: 'bounce 3s infinite' }}>🚀</div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  Prêt à Expédier ?
                </h4>
                <p className="text-gray-300 mb-6">
                  Obtenez votre devis personnalisé en quelques clics
                </p>
                
                <div className="space-y-3">
                  <a
                    href="#calculator"
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Obtenir un Devis
                  </a>
                  <a
                    href="#services"
                    className="block w-full bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
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
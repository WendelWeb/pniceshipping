import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white py-2 shadow-lg fixed bottom-0 left-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="flex items-center">
            <span className="text-sm mr-2">Built by</span>
            <a 
              href="https://stanleywendel.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-300 hover:text-blue-100 transition-colors duration-300 group"
            >
              <span className="font-medium underline-offset-2 group-hover:underline">Stanley Wendel</span>
              <ExternalLink className="ml-1" size={14} />
            </a>
          </div>
          <div className="text-xs text-gray-400 ml-3">
            © {currentYear-12}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
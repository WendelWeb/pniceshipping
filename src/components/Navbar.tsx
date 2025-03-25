// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import AdminButton from "@/admin/components/AdminButton";

const Navbar = () => {
  const isSignedIn = useUser();
  console.log(isSignedIn);

  const [isOpen, setIsOpen] = useState(false);
  const [activateAnimation, setActivateAnimation] = useState("closed");

  function toogleHandler() {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setActivateAnimation("closed");
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setActivateAnimation("active");
      }, 1);
    } else {
      setActivateAnimation("");
    }
  }, [isOpen]);

  return (
    <>
      <nav className="md:bg-white bg-amber-100 md:shadow-sm  fixed w-full top-0 z-50">
        <div className="max-w-8xl mx-auto lg:mx-10 px-4 sm:px-6 lg:px-5 ">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <div className="transform -rotate-45 text-white font-bold">
                    PS
                  </div>
                </div>
                <span className="ml-2 text-xl font-bold ">
                  Pnice Shipping Services
                </span>
              </Link>
            </div>
            <AdminButton />
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex text-xl items-center space-x-8 justify-between">
              <Link to="/home" className="text-gray-700 hover:text-blue-600">
                Accueil
              </Link>

              <a href="#services" className="text-gray-700 hover:text-blue-600">
                Nos services
              </a>
              <a href="#pricings" className="text-gray-700 hover:text-blue-600">
                Nos prix
              </a>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                A propos
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* <Link
              to="/quote"
             
            >
              Sign In
            </Link> */}
              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-600 text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                    Se connecter
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden hamberger">
              <button
                onClick={() => toogleHandler()}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`md:hidden side-nav ${isOpen && activateAnimation} `}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-600 text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                    Se connecter
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              
              {/* gvu */}
              <Link to="/home" className="text-gray-700 block px-3 py-2 hover:text-blue-600" onClick={()=> setIsOpen(false)}>
                Accueil
              </Link>

              <a href="#services" className="text-gray-700 block px-3 py-2 hover:text-blue-600" onClick={()=> setIsOpen(false)}>
                Nos services
              </a>
              <a href="#pricings" className="text-gray-700 block px-3 py-2 hover:text-blue-600" onClick={()=> setIsOpen(false)}>
                Nos prix
              </a>
              <Link to="/about" className="text-gray-700 block px-3 py-2 hover:text-blue-600" onClick={()=> setIsOpen(false)}>
                A propos
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

// Composant pour les liens avec dropdown
// const DropdownLink = ({ title, items }: { title: string; items: string[] }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => setIsOpen(true)}
//       onMouseLeave={() => setIsOpen(false)}
//     >
//       <button className="text-gray-700 hover:text-blue-600 flex items-center">
//         {title}
//         <svg
//           className="ml-1 w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//           <div className="py-1">
//             {items.map((item, index) => (
//               <Link
//                 key={index}
//                 to="#"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 {item}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

export default Navbar;

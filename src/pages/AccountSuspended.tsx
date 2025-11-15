import { motion } from "framer-motion";
import { AlertTriangle, CreditCard, Lock } from "lucide-react";

const AccountSuspended = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 sm:border-4 border-red-500">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 sm:p-6 md:p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-3 sm:mb-4"
            >
              <div className="bg-white rounded-full p-4 sm:p-5 md:p-6">
                <Lock className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-red-600" />
              </div>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-1 sm:mb-2">
              Website Inaccessible
            </h1>
            <p className="text-center text-red-100 text-base sm:text-lg">
              n8n Account Suspended
            </p>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              {/* Alert Box */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-red-900 mb-1 sm:mb-2">
                      Account Suspended Due to Payment Failure
                    </h2>
                    <p className="text-sm sm:text-base text-red-800 leading-relaxed">
                      Your n8n subscription payment has not been processed. As a
                      result, your account has been temporarily suspended and
                      access to this website has been restricted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Payment Required
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To restore access to this website and reactivate your n8n
                  account, please complete the outstanding payment for your
                  subscription.
                </p>
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Status:</span>
                    <span className="ml-2 text-red-600 font-bold">
                      SUSPENDED
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold">Reason:</span>
                    <span className="ml-2">Payment not received</span>
                  </p>
                </div>
              </div>

              {/* Action Required */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                  Action Required
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-1">1.</span>
                    <span>Log in to your n8n account dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-1">2.</span>
                    <span>Navigate to billing and payment settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-1">3.</span>
                    <span>Complete the outstanding payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-1">4.</span>
                    <span>
                      Wait for account reactivation (usually within 24 hours)
                    </span>
                  </li>
                </ul>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact n8n support
                  immediately.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Error Code: N8N-PAYMENT-SUSPENDED-001
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pulsing Warning */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-6"
        >
          <p className="text-red-600 font-semibold text-lg">
            ⚠️ Service Temporarily Unavailable ⚠️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountSuspended;

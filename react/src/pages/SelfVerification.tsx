import { useEffect, useState } from 'react';
import { User, CheckCircle, AlertCircle, Loader, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getUniversalLink } from "@selfxyz/core";
import { SelfAppBuilder, SelfQRcodeWrapper } from '@selfxyz/qrcode';

const SelfVerification = () => {
  const { address } = useAccount();

  const [isRegistered, setIsRegistered] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selfApp, setSelfApp] = useState(null);
  const [universalLink, setUniversalLink] = useState("");

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: address,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Bonjour Cannes!",
        disclosures: {
          /* 1. what you want to verify from users' identity */
          minimumAge: 18,
          // ofac: false,
          // excludedCountries: [countries.BELGIUM],

          /* 2. what you want users to reveal */
          // name: false,
          // issuing_state: true,
          nationality: true,
          // date_of_birth: true,
          // passport_number: false,
          gender: true,
          // expiry_date: false,
        }
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, [address]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Unique User Registration
            </h1>
            <p className="text-gray-600">
              Verify your identity with Self SDK to register as a unique user
            </p>
          </div>

          <div className="space-y-6">
              {/* User Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isRegistered ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">Registered</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <User className="mr-2 h-5 w-5" />
                        <span className="font-medium">Not Registered</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{totalUsers}</p>
                  <p className="text-sm text-indigo-800">Total Registered Users</p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Registration Actions */}
              {!isRegistered && (
                <div className="text-center space-y-4">
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block">
                      <SelfQRcodeWrapper
                        selfApp={selfApp}
                        onSuccess={() => {
                          console.log('Verification successful');
                          // Handle successful verification
                        }}
                        onError={() => {
                          console.error('Failed to verify identity');
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Scan with Self App
                      </p>
                      <p className="text-sm text-gray-600">
                        Open the Self mobile app and scan this QR code to verify your identity
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              How it works:
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Connect your wallet to identify your address</li>
              <li>Click "Start Verification" to generate a QR code</li>
              <li>Download and open the Self mobile app</li>
              <li>Scan the QR code with your passport or ID document</li>
              <li>Complete the verification process on your phone</li>
              <li>Your unique registration will be confirmed on-chain</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfVerification;

import { useEffect, useState } from 'react'
import { getLocations, estimateHousePrice } from './services/service'
import type { Payload } from './types/Payload'

const App = () => {
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [data, setData] = useState<Payload>({
    total_sqft: "",
    bhk: "",
    bath: "",
    location: "",
  });

  const [predictedPrice, setPredictedPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLakh , setIsLakh] = useState<boolean>(true);

  const getAllLocations = async () => {
    const { locations } = await getLocations();
    setAllLocations(locations)
  }

  const estimatePrice = async () => {
    if (data.bath !== "" && data.bhk !== "" && data.location !== "" && data.total_sqft !== "") {
      setIsLoading(true);
      setIsLakh(true);
      try {
        let result = await estimateHousePrice(data);
        const temp = result.toString().split('.')[0].split('')
        if(temp.length > 2){
          setIsLakh(false);
          result = temp[0] + "." + temp[1] + temp[2] + result.toString().split('.')[1]
        }
        setPredictedPrice(result);
      } catch (error) {
        console.error('Error estimating price:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const inputChange = (value: string, key: string) => {
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    getAllLocations();
  }, [])

  useEffect(() => {
    estimatePrice();
  }, [data])

  const handleManualEstimate = () => {
    if (data.bath === "" || data.bhk === "" || data.location === "" || data.total_sqft === "") {
      alert("Please fill all the fields.");
      return;
    }
    estimatePrice();
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col">
        {/* Mobile Header */}
        <div className="text-center mb-4 lg:hidden">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Property Price Estimator</h1>
          <p className="text-xs text-gray-600">Get instant estimates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6 flex-1 min-h-0">
          <div className="flex flex-col min-h-0">
            <div className="text-center mb-4 hidden lg:block">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Property Price Estimator</h1>
              <p className="text-sm text-gray-600">Get instant property value estimates</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📍 Location
                  </label>
                  <select
                    value={data.location}
                    name="location"
                    id="location"
                    onChange={e => inputChange(e.target.value, "location")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  >
                    <option value="">Select location</option>
                    {allLocations.map((loc, index) => (
                      <option key={index} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📐 Total Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="total_sqft"
                    id="total_sqft"
                    placeholder="e.g., 1200"
                    value={data.total_sqft}
                    onChange={e => inputChange(e.target.value, "total_sqft")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🛏️ BHK
                    </label>
                    <input
                      type="number"
                      name="bhk"
                      id="bhk"
                      placeholder="e.g., 2"
                      value={data.bhk}
                      onChange={e => inputChange(e.target.value, "bhk")}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🚿 Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bath"
                      id="bath"
                      placeholder="e.g., 2"
                      value={data.bath}
                      onChange={e => inputChange(e.target.value, "bath")}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  onClick={handleManualEstimate}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">💰</span>
                      Get Estimate
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Result */}
          <div className="flex flex-col justify-center min-h-0">
            {predictedPrice > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">💎</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Estimated Value</h3>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3 break-words">
                  ₹{predictedPrice.toLocaleString('en-IN')} {isLakh ? "Lakh" : "Crore"}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  *Based on current market analysis
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 lg:p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">🏠</span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">Ready to Estimate</h3>
                <p className="text-sm sm:text-base text-gray-500">Fill in your property details to get an instant price estimate</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-4 lg:mt-6 text-gray-500 text-xs">
              <p>Powered by ML algorithms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
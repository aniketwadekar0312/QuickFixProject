import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, X} from "lucide-react";
import {getService} from "../../api/servicesApi"

const HeroBanner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      fetchSearchResults(e.target.value);
    } else {
      setSearchResults([]);
    }
  };

   // Clear search input
   const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };


  // Fetch search results from backend
  const fetchSearchResults = async (query) => {
    if (!query || query.trim() === "") return;
    
    setIsLoading(true);
    try {
      const response = await getService(query);
      if (response.status) {
        setSearchResults(response.services);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click on search result
  const handleResultClick = (category) => {
    setShowResults(false);
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-brand-800 to-brand-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Home Services, Delivered to Your Doorstep
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Find trusted professionals for all your home service needs.
            Book services with just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              <Link to="/services">Book a Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-700">
              <Link to="/worker-register">Join as Service Provider</Link>
            </Button>
          </div>
          
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full p-2 pr-10 outline-none text-gray-800" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                />
                <div className="absolute right-2 top-6 transform -translate-y-1/2">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-accent-500 rounded-full animate-spin"></div>
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="text-accent-500 hover:text-accent-600"
                      aria-label="Search"
                    >
                      <Search className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
                <ul className="py-2 text-left">
                  {searchResults.map((service) => (
                    <li 
                      key={service._id} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                      onClick={() => handleResultClick(service.category?.name)}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.category?.name}</p>
                      </div>
                      <span className="text-sm text-accent-500">{service.workerCount === 0 ? "No providers" : `${service.workerCount} providers`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showResults && searchQuery.length > 2 && searchResults.length === 0 && !isLoading && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10">
                <div className="p-4 text-center text-gray-600">
                  No services found matching "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white opacity-10"></div>
    </div>
  );
};

export default HeroBanner;
import { useState } from "react";
import * as React from "react";
// import { DropdownMenu } from "radix-ui";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  const getDashboardLink = () => {
    if (!currentUser) return "/";
    switch (currentUser.role) {
      case "customer":
        return "/customer/dashboard";
      case "worker":
        return "/worker/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  let menuItems = [];

  if(currentUser?.role === "worker"){
      menuItems.push(
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" }
      );
  }else if(currentUser?.role === "admin"){
      menuItems.push(
        { label: "Home", path: "/" },
        { label: "Categories", path: "/admin/category" },
        { label: "Services", path: "/admin/services" },
        { label: "Find Workers", path: "/workers" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" }
      );
  }else{
    menuItems.push(
      { label: "Home", path: "/" },
      { label: "Services", path: "/services" },
      { label: "Find Workers", path: "/workers" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" }
    );
  }
    
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-700">
            QuickFix
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.length >0 && menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 p-0 rounded-full"
                  >
                    {currentUser?.photoUrl ? (
                      <img
                        src={currentUser.photoUrl}
                        alt={currentUser.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white shadow-lg rounded-lg"
                >
                  {/* Profile Section */}
                  <div className="flex items-center gap-2 p-3">
                    <div className="h-12 w-12">
                      {currentUser?.photoUrl ? (
                        <img
                          src={currentUser.photoUrl}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 p-2 bg-gray-200 rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium">{currentUser?.name}</p>
                      <p className="text-sm text-gray-500">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Dashboard Button */}
                  <DropdownMenuItem asChild>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-2 py-2 px-3 cursor-pointer"
                    >
                      <Settings className="h-5 w-5 text-gray-700" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Logout Button */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 px-3 text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button
                  className="bg-white text-black border border-gray-400 hover:bg-gray-100"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-gray-700 hover:text-brand-600 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block text-gray-700 hover:text-brand-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-800 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  className="bg-white text-black border border-gray-400 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

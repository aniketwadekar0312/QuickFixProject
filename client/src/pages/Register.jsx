import Layout from "@/components/layout/Layout";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Join Our Platform</h1>
              <p className="mt-2 text-gray-600">Create an account to start booking services or offering your skills</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
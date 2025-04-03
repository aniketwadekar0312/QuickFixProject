import React from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calculator, 
  Award, 
  HelpCircle, 
  Download, 
  Users,
  BarChart
} from "lucide-react";

const Resources = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Service Provider Resources</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access tools, guides, and resources to help you grow your business and deliver exceptional service to your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Resource Cards */}
          <ResourceCard 
            icon={<BookOpen className="h-8 w-8" />}
            title="Getting Started Guide"
            description="Learn how to set up your profile, manage bookings, and maximize your earnings."
            linkText="Read Guide"
            linkUrl="#"
            color="bg-blue-50"
            iconColor="text-blue-500"
          />
          
          <ResourceCard 
            icon={<Video className="h-8 w-8" />}
            title="Tutorial Videos"
            description="Step-by-step video tutorials on using the platform and growing your business."
            linkText="Watch Videos"
            linkUrl="#"
            color="bg-purple-50"
            iconColor="text-purple-500"
          />
          
          <ResourceCard 
            icon={<FileText className="h-8 w-8" />}
            title="Service Templates"
            description="Customizable templates for service descriptions, policies, and customer communications."
            linkText="Download Templates"
            linkUrl="#"
            color="bg-green-50"
            iconColor="text-green-500"
          />
          
          <ResourceCard 
            icon={<Calculator className="h-8 w-8" />}
            title="Pricing Calculator"
            description="Tools to help you set competitive prices and maximize your profits."
            linkText="Use Calculator"
            linkUrl="#"
            color="bg-amber-50"
            iconColor="text-amber-500"
          />
          
          <ResourceCard 
            icon={<Award className="h-8 w-8" />}
            title="Best Practices"
            description="Industry best practices and tips to help you deliver exceptional service."
            linkText="Learn More"
            linkUrl="#"
            color="bg-rose-50"
            iconColor="text-rose-500"
          />
          
          <ResourceCard 
            icon={<HelpCircle className="h-8 w-8" />}
            title="FAQs"
            description="Answers to commonly asked questions about working with QuickFix."
            linkText="View FAQs"
            linkUrl="#"
            color="bg-teal-50"
            iconColor="text-teal-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Resource Library</h2>
              <p className="text-gray-600 mb-6">
                Access our comprehensive library of downloadable resources, guides, and tools to help you succeed.
              </p>
              <div className="space-y-4">
                <DownloadItem 
                  icon={<FileText className="h-5 w-5" />}
                  title="Service Provider Handbook"
                  format="PDF"
                />
                <DownloadItem 
                  icon={<Calculator className="h-5 w-5" />}
                  title="Income Calculator Spreadsheet"
                  format="Excel"
                />
                <DownloadItem 
                  icon={<Users className="h-5 w-5" />}
                  title="Customer Communication Templates"
                  format="Word"
                />
                <DownloadItem 
                  icon={<BarChart className="h-5 w-5" />}
                  title="Business Growth Strategy Guide"
                  format="PDF"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Request Custom Resources</h3>
              <p className="text-gray-600 mb-4">
                Need specific resources for your service business? Let us know what would help you succeed.
              </p>
              <Button className="w-full">Request Resources</Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team is ready to assist you with any questions or provide personalized guidance for your business.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="outline">Contact Support</Button>
            <Button>Schedule Consultation</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Components
const ResourceCard = ({ 
  icon, 
  title, 
  description, 
  linkText, 
  linkUrl, 
  color, 
  iconColor 
}) => {
  return (
    <div className={`rounded-lg p-6 ${color} border border-gray-100 hover:shadow-md transition-all`}>
      <div className={`${iconColor} mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href={linkUrl} 
        className="text-primary font-medium hover:underline flex items-center"
      >
        {linkText}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </a>
    </div>
  );
};

const DownloadItem = ({ icon, title, format }) => {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="text-gray-500">{icon}</div>
        <span>{title}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mr-2">{format}</span>
        <Button size="sm" variant="ghost">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Resources;
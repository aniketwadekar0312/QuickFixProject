import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Users, Clock, Shield, Star, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-brand-600 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">About QuickFix</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Connecting quality service providers with customers since 2023, we're on a mission
              to transform how home services are discovered and delivered.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700 mb-4">
              QuickFix was founded with a simple idea: make it easier for people to find reliable 
                home service professionals. What started as a small platform connecting a few local 
                contractors with homeowners has grown into a comprehensive service marketplace.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder experienced firsthand the frustration of finding qualified professionals 
                for home repairs and maintenance. After a series of disappointing experiences with 
                unreliable contractors, they decided to create a solution that would benefit both 
                service providers and customers.
              </p>
              <p className="text-gray-700">
                Today, QuickFix helps thousands of customers find the right professionals for their 
                needs while providing service providers with opportunities to grow their businesses. 
                Our platform focuses on quality, reliability, and transparency to ensure positive 
                experiences for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <Shield className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
                <p className="text-gray-600">
                  We prioritize building a safe and trustworthy platform through thorough vetting and verification.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <Star className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
                <p className="text-gray-600">
                  We're committed to maintaining high standards through our rating system and regular quality checks.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <Users className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive community of professionals and customers built on respect and collaboration.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <CheckCircle className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                <p className="text-gray-600">
                  We ensure dependable service through strict scheduling and completion policies.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <Clock className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Convenience</h3>
                <p className="text-gray-600">
                  We make booking and managing services simple with our user-friendly platform.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
                <Award className="mx-auto h-12 w-12 text-brand-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our platform and service delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience QuickFix?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found reliable service providers for their home needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

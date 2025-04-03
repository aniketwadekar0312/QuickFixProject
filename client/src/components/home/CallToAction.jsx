import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-700 to-brand-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Home?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Join thousands of satisfied customers who trust QuickFix for their home service needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
            <Link to="/services">Book a Service</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-700">
            <Link to="/worker-register">Become a Service Provider</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
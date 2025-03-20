import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import ServiceCategories from "@/components/home/ServiceCategories";
import FeaturedWorkers from "@/components/home/FeaturedWorkers";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <ServiceCategories />
      <HowItWorks />
      <FeaturedWorkers />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;


import RegistrationForm from "@/components/registration/RegistrationForm";

const RegistrationFormPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-tpahla-darkgreen text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">
            Register for TPAHLA 2025
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-6">
            The Pan-African Humanitarian Leadership Award - Where Honor Meets Purpose
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>Abuja Continental Hotel, Nigeria</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🗓️</span>
              <span>October 15-19, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>Hosted by IHSD | AREF | UNITAR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12">
        <RegistrationForm />
      </div>

      {/* Footer Info */}
      <div className="bg-tpahla-purple/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-tpahla-text-secondary mb-4">
            Your participation fuels a continental vision. All proceeds support the development of
            The Pan-African Humanitarian Resource Centre (TPAHRC).
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <span>📧 2025@tpahla.africa</span>
            <span>📞 +234-802-368-6143</span>
            <span>🌐 www.tpahla.africa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPage;


import RegistrationForm from "@/components/registration/RegistrationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventItinerary, awardCategories } from "@/lib/registrationData";

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

      {/* Event Information Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Event Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-tpahla-gold">2025 Event Itinerary</CardTitle>
              <CardDescription>Your 5-day journey of recognition and impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventItinerary.map((day, index) => (
                  <div key={index} className="border-l-2 border-tpahla-gold pl-4">
                    <h4 className="font-semibold text-tpahla-text-primary">{day.date}</h4>
                    <h5 className="text-sm font-medium text-tpahla-gold mb-2">{day.title}</h5>
                    <ul className="text-sm text-tpahla-text-secondary space-y-1">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-tpahla-gold mr-2">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Award Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-tpahla-gold">Award Categories</CardTitle>
              <CardDescription>10 prestigious categories recognizing humanitarian excellence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {awardCategories.slice(0, 8).map((category, index) => (
                  <div key={category.id} className="p-3 bg-tpahla-purple/5 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-tpahla-text-primary text-sm">{category.name}</h5>
                        <p className="text-xs text-tpahla-text-secondary mt-1">{category.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">+ 2 additional categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Participate Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-tpahla-gold text-center">Why Become a TPAHLA 2025 Honoree?</CardTitle>
            <CardDescription className="text-center">Join Africa's most prestigious humanitarian recognition platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🌍</div>
                <h4 className="font-semibold mb-2">Continental Recognition</h4>
                <p className="text-sm text-tpahla-text-secondary">Thought leadership influence across Africa</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤝</div>
                <h4 className="font-semibold mb-2">Power Network Access</h4>
                <p className="text-sm text-tpahla-text-secondary">Connect with Africa's humanitarian leaders</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📺</div>
                <h4 className="font-semibold mb-2">International Media</h4>
                <p className="text-sm text-tpahla-text-secondary">Global visibility and legacy branding</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏨</div>
                <h4 className="font-semibold mb-2">VIP Hospitality</h4>
                <p className="text-sm text-tpahla-text-secondary">Luxury accommodation and experiences</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Strategic Mentorship</h4>
                <p className="text-sm text-tpahla-text-secondary">Policy engagement and guidance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-semibold mb-2">Legacy Immortalization</h4>
                <p className="text-sm text-tpahla-text-secondary">Inclusion in TPAHLA Resource Center</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
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
            <span>📧 tpahla@ihsd-ng.org</span>
            <span>📞 +234-802-368-6143</span>
            <span>📞 +234-806-039-6906</span>
            <span>🌐 www.tpahla.africa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPage;

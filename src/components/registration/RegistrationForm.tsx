
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { registrationFormSchema, type RegistrationFormData } from "@/lib/validators/registrationValidator";
import { registrationCategories, addOns } from "@/lib/registrationData";
import { africanCountries } from "@/lib/africanCountries";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      country: "",
      category: "",
      quantity: 1,
      addOns: [],
      specialRequests: "",
      termsAccepted: false,
    },
  });

  const watchedValues = form.watch(["category", "quantity", "addOns"]);

  useEffect(() => {
    const [category, quantity, selectedAddOns] = watchedValues;
    
    if (category && quantity) {
      const selectedCategory = registrationCategories.find(cat => cat.id === category);
      const basePrice = selectedCategory ? selectedCategory.price * quantity : 0;
      
      const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
        const addOn = addOns.find(ao => ao.id === addOnId);
        return total + (addOn ? addOn.price : 0);
      }, 0);
      
      setTotalPrice(basePrice + addOnsPrice);
    }
  }, [watchedValues]);

  const onSubmit = (data: RegistrationFormData) => {
    console.log("Registration data:", { ...data, totalPrice });
    
    // Simulate payment gateway redirect
    toast({
      title: "Redirecting to Payment Gateway",
      description: "You will be redirected to complete your payment...",
    });
    
    // In real implementation, this would redirect to Flutterwave/Paystack
    setTimeout(() => {
      window.open("https://paystack.com", "_blank");
    }, 2000);
  };

  const selectedCategory = registrationCategories.find(cat => cat.id === form.watch("category"));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Registration Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-tpahla-gold">
          Register for TPAHLA 2025
        </h1>
        <p className="text-lg text-tpahla-text-secondary max-w-2xl mx-auto">
          Join Africa's premier humanitarian leadership awards ceremony in Abuja, Nigeria
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-tpahla-text-secondary">
          <span>📍 Abuja Continental Hotel</span>
          <span>•</span>
          <span>🗓️ October 15-19, 2025</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Please provide your personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {africanCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Your organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position/Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your position or title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Registration Category */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Category</CardTitle>
              <CardDescription>Select your participation category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select registration category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {registrationCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              <span>{category.tier}</span>
                              <span>{category.name}</span>
                              <Badge variant="secondary">${category.price.toLocaleString()}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCategory && (
                <div className="p-4 bg-tpahla-purple/5 rounded-lg border">
                  <h4 className="font-semibold mb-2">{selectedCategory.tier} {selectedCategory.name}</h4>
                  <p className="text-sm text-tpahla-text-secondary mb-3">{selectedCategory.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {selectedCategory.includes.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-tpahla-gold mr-2">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {selectedCategory.includes.length > 3 && (
                        <li className="text-tpahla-text-secondary">
                          ... and {selectedCategory.includes.length - 3} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>Number of registrations</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <CardTitle>Optional Add-ons</CardTitle>
              <CardDescription>Enhance your experience with additional services</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="addOns"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addOns.map((addOn) => (
                        <FormField
                          key={addOn.id}
                          control={form.control}
                          name="addOns"
                          render={({ field }) => (
                            <FormItem
                              key={addOn.id}
                              className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(addOn.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, addOn.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== addOn.id)
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <div className="flex items-center justify-between">
                                  <FormLabel className="font-medium">
                                    {addOn.name}
                                  </FormLabel>
                                  <Badge variant="outline">${addOn.price}</Badge>
                                </div>
                                <FormDescription className="text-sm">
                                  {addOn.description}
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
              <CardDescription>Any special accommodations or requests</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please specify any dietary requirements, accessibility needs, or other special requests"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Terms and Total */}
          <Card>
            <CardHeader>
              <CardTitle>Summary & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Breakdown */}
              <div className="bg-tpahla-purple/5 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Price Breakdown</h4>
                <div className="space-y-2">
                  {selectedCategory && (
                    <div className="flex justify-between">
                      <span>{selectedCategory.name} × {form.watch("quantity")}</span>
                      <span>${(selectedCategory.price * form.watch("quantity")).toLocaleString()}</span>
                    </div>
                  )}
                  {form.watch("addOns").map((addOnId) => {
                    const addOn = addOns.find(ao => ao.id === addOnId);
                    return addOn ? (
                      <div key={addOn.id} className="flex justify-between text-sm">
                        <span>{addOn.name}</span>
                        <span>${addOn.price}</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-tpahla-gold">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions *
                      </FormLabel>
                      <FormDescription>
                        I understand that registration fees are non-refundable but transferable up to September 15, 2025.
                        I agree to the event terms and conditions.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white font-medium"
                disabled={totalPrice === 0}
              >
                Pay Now - ${totalPrice.toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;

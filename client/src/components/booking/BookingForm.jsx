import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockServices, mockWorkers } from "@/data/mockData";
import { format } from "date-fns";
import { CalendarIcon, Phone, Home } from "lucide-react";
import { cn } from "@/lib/utils";


const BookingForm = ({
  selectedService,
  setSelectedService,
  selectedWorker,
  setSelectedWorker,
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  address,
  setAddress,
  additionalNotes,
  setAdditionalNotes,
  paymentMethod,
  setPaymentMethod,
  contactNumber,
  setContactNumber,
  handleSubmit,
  isSubmitting,
  services,
  workers,
}) => {
  // Get filtered workers based on selected service
  
  const filteredWorkers = selectedService
    ? workers.filter(
        (worker) =>
          worker.services.includes(
            services.find((s) => s._id === selectedService)?.name || ""
          ) &&
          // worker.status === "approved" &&
          worker.available
      )
    : [];

    useEffect(() => {
      if (selectedService) {
        if (filteredWorkers.length > 0 && !selectedWorker) {
          setSelectedWorker(filteredWorkers[0]._id); // Auto-select first worker only if none is selected
        } else if (filteredWorkers.length === 0) {
          setSelectedWorker(""); // Reset selection if no workers available
        }
      }
    }, [selectedService, filteredWorkers]);

  // Time slots
  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Select Service</Label>
            <Select 
              value={selectedService} 
              onValueChange={setSelectedService}
              required
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service._id} value={service._id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Worker Selection */}
          {selectedService && (
            <div className="space-y-2">
              <Label htmlFor="worker">Select Service Provider</Label>
              <Select 
                value={selectedWorker} 
                onValueChange={setSelectedWorker}
              >
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Choose a service provider (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredWorkers.map((worker) => (
                    <SelectItem key={worker._id} value={worker._id}>
                      {worker.name} ({worker.rating.toFixed(1)} ★)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filteredWorkers.length === 0 && selectedService && (
                <p className="text-sm text-amber-600">No available providers for this service at the moment.</p>
              )}
            </div>
          )}
          
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Select Time Slot</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot} required>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number</Label>
            <div className="flex">
              <Phone className="h-5 w-5 mr-2 mt-2.5 text-gray-500" />
              <Input
                id="phone"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Your phone number"
                required
              />
            </div>
          </div>
          
          {/* Service Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Service Address</Label>
            <div className="flex">
              <Home className="h-5 w-5 mr-2 mt-2.5 text-gray-500" />
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete address"
                required
              />
            </div>
          </div>
          
          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific requirements or instructions"
            />
          </div>
          
          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger id="payment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
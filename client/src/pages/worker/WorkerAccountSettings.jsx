import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AtSign, Phone, User, MapPin, Shield, Bell, Lock, Upload } from "lucide-react";

const WorkerAccountSettings = () => {
  const { toast } = useToast();

const [workerData, setWorkerData] = useState({
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "555-987-6543",
  address: "123 Worker Street, Mumbai, Maharashtra",
  description: "Experienced plumber with 5+ years of experience in residential and commercial plumbing.",
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  }
});

const handleSaveProfile = () => {
  toast({
    title: "Profile updated",
    description: "Your profile information has been updated successfully."
  });
};

const handleSavePassword = () => {
  toast({
    title: "Password updated",
    description: "Your password has been updated successfully."
  });
};

const handleSaveNotifications = () => {
  toast({
    title: "Notification preferences updated",
    description: "Your notification preferences have been updated."
  });
};

const handleToggleNotification = (type) => {
  setWorkerData({
    ...workerData,
    notifications: {
      ...workerData.notifications,
      [type]: !workerData.notifications[type]
    }
  });
};

const handleToggleDay = (day) => {
  setWorkerData({
    ...workerData,
    availability: {
      ...workerData.availability,
      [day]: !workerData.availability[day]
    }
  });
};
return (
  <Layout>
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and profile information</p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal information visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={workerData.name}
                      onChange={(e) => setWorkerData({...workerData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <AtSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="email"
                        value={workerData.email}
                        className="rounded-l-none"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <Phone className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="phone"
                        value={workerData.phone}
                        onChange={(e) => setWorkerData({...workerData, phone: e.target.value})}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <MapPin className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="address"
                        value={workerData.address}
                        onChange={(e) => setWorkerData({...workerData, address: e.target.value})}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Professional Description</Label>
                  <Textarea
                    id="description"
                    value={workerData.description}
                    onChange={(e) => setWorkerData({...workerData, description: e.target.value})}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Describe your professional experience and skills (max 200 characters)
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src="https://i.pravatar.cc/150?img=2"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Photo
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications about bookings and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive booking updates via email</p>
                  </div>
                  <Switch
                    checked={workerData.notifications.email}
                    onCheckedChange={() => handleToggleNotification('email')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates in the app</p>
                  </div>
                  <Switch
                    checked={workerData.notifications.push}
                    onCheckedChange={() => handleToggleNotification('push')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via text message</p>
                  </div>
                  <Switch
                    checked={workerData.notifications.sms}
                    onCheckedChange={() => handleToggleNotification('sms')}
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security
              </CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSavePassword}>
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Availability Schedule
              </CardTitle>
              <CardDescription>
                Set your weekly availability for service bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(workerData.availability).map(([day, available]) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Switch
                      id={`day-${day}`}
                      checked={available}
                      onCheckedChange={() => handleToggleDay(day)}
                    />
                    <Label htmlFor={`day-${day}`} className="capitalize">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveProfile}>
                  Save Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </Layout>
);
};

export default WorkerAccountSettings;
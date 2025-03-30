import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { getWorkerBookings, updateBookingStatus } from '../../api/workerApi';

const PendingRequests = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await getWorkerBookings();
      const pending = response.data.filter(booking => booking.status === 'pending');
      setPendingBookings(pending);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch pending bookings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast({
        title: 'Success',
        description: `Booking ${status} successfully`
      });
      fetchPendingBookings(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${status} booking`
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Service Requests</h2>
      {pendingBookings.length === 0 ? (
        <p className="text-muted-foreground">No pending requests</p>
      ) : (
        pendingBookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle>{booking.service.name}</CardTitle>
              <CardDescription>
                Customer: {booking.customer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString('en-IN')}</p>
                <p><span className="font-medium">Time:</span> {booking.time}</p>
                <p><span className="font-medium">Amount:</span> ${booking.service.price}</p>
              </div>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button
                variant="default"
                onClick={() => handleStatusUpdate(booking._id, 'accepted')}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingRequests;
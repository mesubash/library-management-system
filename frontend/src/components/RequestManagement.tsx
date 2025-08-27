import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBorrowRecords } from "@/hooks/useLibraryData";
import { CheckCircle, XCircle, Clock, User, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RequestManagement() {
  const { records, loading, approveRequest, rejectRequest, confirmBorrow } = useBorrowRecords();
  const { toast } = useToast();
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter records by status
  const pendingRequests = records.filter(record => record.status === 'requested');
  const approvedRequests = records.filter(record => record.status === 'approved');
  const borrowedBooks = records.filter(record => record.status === 'borrowed');

  const handleApprove = async (recordId: string) => {
    setIsProcessing(true);
    try {
      const result = await approveRequest(recordId);
      if (!result.error) {
        toast({
          title: "Request Approved",
          description: "The borrow request has been approved. User will be notified.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await rejectRequest(selectedRequest.id, rejectionReason);
      if (!result.error) {
        toast({
          title: "Request Rejected",
          description: "The borrow request has been rejected. User will be notified.",
        });
        setIsRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectionReason("");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmBorrow = async (recordId: string) => {
    setIsProcessing(true);
    try {
      const result = await confirmBorrow(recordId);
      if (!result.error) {
        toast({
          title: "Pickup Confirmed",
          description: "Book has been handed over to the user.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
          <CardDescription>
            New borrow requests awaiting your review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending requests
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.books?.title}</p>
                        <p className="text-sm text-muted-foreground">by {request.books?.author}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.users?.name}</p>
                        <p className="text-sm text-muted-foreground">{request.users?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(request.requested_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(request)}
                          disabled={isProcessing}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approved Requests (Ready for Pickup) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Ready for Pickup ({approvedRequests.length})
          </CardTitle>
          <CardDescription>
            Approved books waiting for user pickup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No approved requests awaiting pickup
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.books?.title}</p>
                        <p className="text-sm text-muted-foreground">by {request.books?.author}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.users?.name}</p>
                        <p className="text-sm text-muted-foreground">{request.users?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.approved_date ? new Date(request.approved_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleConfirmBorrow(request.id)}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Confirm Pickup
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Currently Borrowed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-500" />
            Currently Borrowed ({borrowedBooks.length})
          </CardTitle>
          <CardDescription>
            Books currently checked out to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {borrowedBooks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No books currently borrowed
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Borrowed Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.books?.title}</p>
                        <p className="text-sm text-muted-foreground">by {record.books?.author}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.users?.name}</p>
                        <p className="text-sm text-muted-foreground">{record.users?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {new Date(record.due_date).toLocaleDateString()}
                        {new Date(record.due_date) < new Date() && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Borrowed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reject Request Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Borrow Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. The user will be notified.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="p-4 rounded-lg border mb-4">
              <p className="font-medium">{selectedRequest.books?.title}</p>
              <p className="text-sm text-muted-foreground">
                Requested by {selectedRequest.users?.name}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason for rejection</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Book is damaged, Book is reserved for class, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

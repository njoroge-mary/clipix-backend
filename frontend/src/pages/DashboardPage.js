import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Video, 
  ArrowLeft, 
  Plus, 
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import apiService from '@/services/apiService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusChecks, setStatusChecks] = useState([]);
  const [apiStatus, setApiStatus] = useState(null);
  const [clientName, setClientName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load health status
      const health = await apiService.getHealth();
      setApiStatus(health);

      // Load status checks
      const checks = await apiService.getStatusChecks();
      setStatusChecks(checks);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStatusCheck = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error('Please enter a client name');
      return;
    }

    setSubmitting(true);
    try {
      const newCheck = await apiService.createStatusCheck(clientName);
      setStatusChecks([newCheck, ...statusChecks]);
      setClientName('');
      toast.success('Status check created successfully!');
    } catch (error) {
      console.error('Error creating status check:', error);
      toast.error('Failed to create status check');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" data-testid="dashboard-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              data-testid="back-to-home-btn"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Clipix Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {apiStatus && (
              <Badge 
                variant={apiStatus.status === 'healthy' ? 'default' : 'destructive'}
                data-testid="api-status-badge"
              >
                <Activity className="h-3 w-3 mr-1" />
                {apiStatus.status === 'healthy' ? 'Online' : 'Offline'}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadDashboardData}
              disabled={loading}
              data-testid="refresh-btn"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="status-overview-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor your Clipix backend services</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : apiStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Service: {apiStatus.service}</p>
                        <p className="text-sm text-muted-foreground">Version: {apiStatus.version || '1.0.0'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Database: Connected</p>
                        <p className="text-sm text-muted-foreground">
                          {apiStatus.database === 'connected' ? 'MongoDB operational' : 'Status unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Last checked: {formatTimestamp(apiStatus.timestamp)}
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Unable to fetch system status</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Status Checks List */}
            <Card data-testid="status-checks-card">
              <CardHeader>
                <CardTitle>Recent Status Checks</CardTitle>
                <CardDescription>
                  {statusChecks.length} total checks recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : statusChecks.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {statusChecks.map((check) => (
                      <div 
                        key={check.id} 
                        className="border rounded-lg p-4 hover:bg-accent transition-colors"
                        data-testid={`status-check-${check.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{check.client_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(check.timestamp)}
                            </p>
                          </div>
                          <Badge variant="outline">ID: {check.id.slice(0, 8)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No status checks yet</p>
                    <p className="text-sm">Create your first status check to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Create Status Check Form */}
          <div className="lg:col-span-1">
            <Card data-testid="create-status-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Status Check</span>
                </CardTitle>
                <CardDescription>
                  Record a new system status check
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStatusCheck} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Enter client name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      disabled={submitting}
                      data-testid="client-name-input"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitting}
                    data-testid="create-status-btn"
                  >
                    {submitting ? 'Creating...' : 'Create Status Check'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Checks</span>
                  <Badge variant="secondary" data-testid="total-checks-badge">
                    {statusChecks.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Status</span>
                  <Badge 
                    variant={apiStatus?.status === 'healthy' ? 'default' : 'destructive'}
                  >
                    {apiStatus?.status || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

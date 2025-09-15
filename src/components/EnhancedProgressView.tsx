import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  HardDrive, 
  Pause, 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Shield,
  Zap,
  FileText,
  Download,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedProgressViewProps {
  onComplete: () => void;
  onCancel: () => void;
  config?: any;
}

type WipeStatus = "running" | "paused" | "stopped" | "completed";

const EnhancedProgressView = ({ onComplete, onCancel, config }: EnhancedProgressViewProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<WipeStatus>("running");
  const [currentAction, setCurrentAction] = useState("Initializing secure erase...");
  const [currentPass, setCurrentPass] = useState(1);
  const [totalPasses] = useState(config?.overwritePasses || 3);
  const [sectorsCompleted, setSectorsCompleted] = useState(0);
  const [totalSectors] = useState(976773168); // 500GB drive sectors
  const [wipedAreas, setWipedAreas] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showFinalConfirmDialog, setShowFinalConfirmDialog] = useState(false);
  const { toast } = useToast();

  const areas = [
    "Boot Sector", "Primary Partition", "System Files", "User Data",
    "Application Data", "Temporary Files", "Deleted Files Area",
    "Slack Space", "Bad Sectors", "Reserved Areas"
  ];

  // Time tracking
  useEffect(() => {
    if (status === "running") {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Progress simulation
  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (Math.random() * 2 + 0.5);
          
          if (newProgress >= 100) {
            setCurrentAction("Wipe completed successfully");
            setStatus("completed");
            setTimeout(() => {
              onComplete();
            }, 2000);
            return 100;
          }

          // Update sectors and current pass
          const newSectors = Math.floor((newProgress / 100) * totalSectors);
          setSectorsCompleted(newSectors);
          
          const currentPassCalc = Math.floor((newProgress / 100) * totalPasses) + 1;
          if (currentPassCalc !== currentPass && currentPassCalc <= totalPasses) {
            setCurrentPass(currentPassCalc);
          }

          // Update wiped areas
          const areaIndex = Math.floor((newProgress / 100) * areas.length);
          if (areaIndex < areas.length && !wipedAreas.includes(areas[areaIndex])) {
            setWipedAreas(prev => [...prev, areas[areaIndex]]);
          }

          // Update action based on progress
          if (newProgress < 10) {
            setCurrentAction("Scanning drive structure and partitions...");
          } else if (newProgress < 20) {
            setCurrentAction(`Overwriting boot sector and partition tables (Pass ${currentPass})`);
          } else if (newProgress < 80) {
            setCurrentAction(`Overwriting data sectors with random patterns (Pass ${currentPass})`);
          } else if (newProgress < 95) {
            setCurrentAction("Verifying erasure and checking for residual data...");
          } else {
            setCurrentAction("Finalizing secure wipe and clearing caches...");
          }

          return newProgress;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [status, currentPass, totalPasses, areas, wipedAreas, onComplete, totalSectors]);

  const handlePause = () => {
    setStatus("paused");
    setCurrentAction("Wipe process paused - data partially erased");
    toast({
      title: "Process Paused",
      description: "You can resume or stop the wipe process.",
    });
  };

  const handleResume = () => {
    setStatus("running");
    toast({
      title: "Process Resumed",
      description: "Continuing secure wipe...",
    });
  };

  const handleStop = () => {
    setShowFinalConfirmDialog(true);
  };

  const confirmStop = () => {
    setStatus("stopped");
    setCurrentAction("Wipe process stopped - drive partially erased");
    setShowFinalConfirmDialog(false);
    toast({
      title: "Process Stopped",
      description: "Wipe has been terminated. Some data may still be recoverable.",
      variant: "destructive",
    });
  };

  const handleRestore = () => {
    // This would trigger actual restore process
    setShowRestoreDialog(false);
    toast({
      title: "Restore Started",
      description: "Attempting to recover non-overwritten sectors...",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "running": return "text-primary";
      case "paused": return "text-orange-500";
      case "stopped": return "text-destructive";
      case "completed": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-card animate-pulse-glow">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <HardDrive className={`w-8 h-8 text-primary-foreground ${status === "running" ? "animate-pulse" : ""}`} />
          </div>
          <CardTitle className="text-2xl">Secure Drive Erasure</CardTitle>
          <Badge 
            variant={status === "running" ? "default" : status === "paused" ? "secondary" : status === "stopped" ? "destructive" : "outline"}
            className="w-fit mx-auto text-base px-4 py-1"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Main Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Overall Progress</h3>
              <span className="text-2xl font-mono font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-6" />
            
            <div className="text-center">
              <p className={`text-lg ${getStatusColor()} animate-pulse`}>
                {currentAction}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progress Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Wipe Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current Pass:</span>
                    <span className="font-semibold">{currentPass} of {totalPasses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sectors Completed:</span>
                    <span className="font-mono text-xs">{sectorsCompleted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Sectors:</span>
                    <span className="font-mono text-xs">{totalSectors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time Elapsed:</span>
                    <span className="font-mono">{formatTime(timeElapsed)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Control Buttons */}
              <div className="space-y-3">
                {status === "running" && (
                  <>
                    <Button 
                      onClick={handlePause}
                      variant="secondary"
                      className="w-full flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pause Process
                    </Button>
                    <Button 
                      onClick={handleStop}
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop Process
                    </Button>
                  </>
                )}
                
                {status === "paused" && (
                  <>
                    <Button 
                      onClick={handleResume}
                      className="w-full flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Resume Process
                    </Button>
                    <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="w-full flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Attempt Data Recovery
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Data Recovery Attempt
                          </DialogTitle>
                          <DialogDescription>
                            Attempt to recover data from sectors that haven't been overwritten yet.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              <strong>Warning:</strong> This will only recover data from sectors that haven't been overwritten yet. 
                              Already wiped areas ({Math.round(progress)}%) cannot be recovered.
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => setShowRestoreDialog(false)}
                              variant="outline" 
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleRestore}
                              className="flex-1"
                            >
                              Start Recovery
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      onClick={handleStop}
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop Process
                    </Button>
                  </>
                )}
                
                {status === "stopped" && (
                  <Button 
                    onClick={onCancel}
                    variant="outline"
                    className="w-full"
                  >
                    Return to Setup
                  </Button>
                )}
              </div>
            </div>

            {/* Middle Column - Areas Being Wiped */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Areas Being Wiped
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {areas.map((area, index) => {
                    const isCompleted = wipedAreas.includes(area);
                    const isCurrent = index === wipedAreas.length && status === "running";
                    
                    return (
                      <div 
                        key={area}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isCompleted 
                            ? "bg-success/10 border-success/20" 
                            : isCurrent 
                            ? "bg-primary/10 border-primary/20 animate-pulse" 
                            : "bg-muted/50"
                        }`}
                      >
                        <span className="text-sm font-medium">{area}</span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-success" />
                        )}
                        {isCurrent && (
                          <Zap className="w-4 h-4 text-primary animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Live Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Multi-Pass Overwrite</p>
                    <p className="text-sm text-muted-foreground">DoD 5220.22-M Standard</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Random Pattern:</span>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex justify-between">
                      <span>Complement Pattern:</span>
                      {currentPass >= 2 ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Verification Pass:</span>
                      {currentPass >= 3 ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Preview */}
              {progress > 50 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Certificate Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center p-4 border-2 border-dashed rounded-lg">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Certificate generating...</p>
                      <Badge variant="outline" className="mt-2">
                        CERT-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={status !== "completed"}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation Dialog */}
      <Dialog open={showFinalConfirmDialog} onOpenChange={setShowFinalConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Stop Wipe Process?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to stop the secure wipe process? This will leave the drive in a partially wiped state.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> Stopping now means {Math.round(progress)}% of your data has been destroyed, 
                but {Math.round(100 - progress)}% may still be recoverable.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowFinalConfirmDialog(false)}
                variant="outline" 
                className="flex-1"
              >
                Continue Wiping
              </Button>
              <Button 
                onClick={confirmStop}
                variant="destructive"
                className="flex-1"
              >
                Stop Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProgressView;
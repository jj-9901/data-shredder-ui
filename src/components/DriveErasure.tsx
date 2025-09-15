import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Shield, AlertTriangle, CheckCircle, FileText, Clock, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DriveInfo {
  name: string;
  path: string;
  size: string;
  type: string;
  model: string;
  serial: string;
}

type EraseState = "idle" | "confirming" | "erasing" | "completed";
type EraseMethod = "quick" | "secure";

const DriveErasure = () => {
  const [eraseState, setEraseState] = useState<EraseState>("idle");
  const [eraseMethod, setEraseMethod] = useState<EraseMethod>("quick");
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const { toast } = useToast();

  // Mock drive info - in real app this would come from system detection
  const driveInfo: DriveInfo = {
    name: "Primary Drive",
    path: "/dev/sda",
    size: "500GB",
    type: "HDD",
    model: "Samsung SSD 980 PRO",
    serial: "S6XNMU0R123456"
  };

  const certificateId = "CERT-2024-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const startTime = new Date().toLocaleString();
  const endTime = new Date(Date.now() + 45 * 60 * 1000).toLocaleString(); // 45 mins later

  // Simulate erasure progress
  useEffect(() => {
    if (eraseState === "erasing") {
      const actions = [
        "Initializing secure erase...",
        "Scanning drive sectors...",
        "Overwriting data (Pass 1 of 3)...",
        "Overwriting data (Pass 2 of 3)...",
        "Overwriting data (Pass 3 of 3)...",
        "Verifying erasure...",
        "Finalizing secure wipe..."
      ];

      let actionIndex = 0;
      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += Math.random() * 8 + 2;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          setCurrentAction("Erasure completed successfully");
          setTimeout(() => {
            setEraseState("completed");
            toast({
              title: "Drive Erasure Complete",
              description: "All data has been securely wiped from the drive.",
            });
          }, 1000);
          clearInterval(interval);
          return;
        }

        setProgress(currentProgress);
        
        // Update action based on progress
        const newActionIndex = Math.floor((currentProgress / 100) * actions.length);
        if (newActionIndex !== actionIndex && newActionIndex < actions.length) {
          actionIndex = newActionIndex;
          setCurrentAction(actions[actionIndex]);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [eraseState, toast]);

  const handleWipeClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmWipe = () => {
    const isValidConfirmation = confirmText.toUpperCase() === "DELETE" || confirmChecked;
    
    if (!isValidConfirmation) {
      toast({
        title: "Confirmation Required",
        description: "Please type DELETE or check the confirmation box.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(false);
    setEraseState("erasing");
    setProgress(0);
    setCurrentAction("Preparing to erase drive...");
    
    toast({
      title: "Erasure Started",
      description: `Starting ${eraseMethod} erase of ${driveInfo.name}`,
    });
  };

  const resetToIdle = () => {
    setEraseState("idle");
    setProgress(0);
    setCurrentAction("");
    setConfirmText("");
    setConfirmChecked(false);
  };

  if (eraseState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-success animate-success-bounce">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </div>
            <CardTitle className="text-2xl text-success">Erase Status: SUCCESS</CardTitle>
            <CardDescription>Drive has been securely wiped</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Device Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Device</Label>
                    <p className="font-mono text-sm">{driveInfo.path} – {driveInfo.size} {driveInfo.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                    <p className="text-sm">{driveInfo.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Serial</Label>
                    <p className="font-mono text-sm">{driveInfo.serial}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Erasure Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Method</Label>
                    <p className="text-sm">ATA Secure Erase ({eraseMethod === "secure" ? "Multi-pass" : "Single-pass"})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Started</Label>
                    <p className="text-sm">{startTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Completed</Label>
                    <p className="text-sm">{endTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Certificate</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Certificate ID</Label>
                    <Badge variant="outline" className="font-mono">{certificateId}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Erasure Certificate</DialogTitle>
                          <DialogDescription>
                            Official certificate of secure data erasure
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="text-center border-2 border-dashed border-muted p-8 rounded-lg">
                            <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Certificate preview</p>
                            <p className="font-mono text-xs mt-2">{certificateId}</p>
                          </div>
                          <Button className="w-full" variant="outline">
                            Download PDF
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button onClick={resetToIdle} variant="outline" className="w-full">
                      Erase Another Drive
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    );
  }

  if (eraseState === "erasing") {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-card animate-pulse-glow">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <HardDrive className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
            <CardTitle>Erasing Drive</CardTitle>
            <CardDescription className="font-mono text-sm">
              {driveInfo.path} – {driveInfo.size} {driveInfo.type}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Progress</Label>
                    <span className="text-lg font-mono font-bold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-4" />
                </div>
                
                <div className="text-center">
                  <p className="text-base text-muted-foreground animate-pulse">
                    {currentAction}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Erasure Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span>{eraseMethod === "secure" ? "Secure Multi-pass" : "Quick Single-pass"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device:</span>
                    <span className="font-mono">{driveInfo.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{driveInfo.size} {driveInfo.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-sm text-muted-foreground mt-6">
                  <Clock className="w-4 h-4 mr-2" />
                  This may take several minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-card animate-fade-in">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <HardDrive className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle>Drive Erasure</CardTitle>
          <CardDescription>Secure data destruction utility</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Device Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Device Information</h3>
                <div className="p-6 bg-muted rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <HardDrive className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-base font-medium">
                        {driveInfo.path} – {driveInfo.size} {driveInfo.type}
                      </p>
                      <p className="text-sm text-muted-foreground">{driveInfo.model}</p>
                      <p className="text-xs text-muted-foreground font-mono">Serial: {driveInfo.serial}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-4 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive mt-1 animate-warning-pulse" />
                <div>
                  <p className="text-base font-semibold text-destructive mb-2">
                    All data will be permanently lost
                  </p>
                  <p className="text-sm text-destructive/80">
                    This action cannot be undone. Confirm only if you want to permanently delete all data on this drive.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Options and Action */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Erase Options</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="quick"
                        checked={eraseMethod === "quick"}
                        onCheckedChange={() => setEraseMethod("quick")}
                        className="mt-1"
                      />
                      <div className="grid gap-2 leading-none">
                        <Label htmlFor="quick" className="text-base font-medium cursor-pointer">
                          Quick Erase (1-pass)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Single overwrite pass. Faster completion but less secure against data recovery.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="secure"
                        checked={eraseMethod === "secure"}
                        onCheckedChange={() => setEraseMethod("secure")}
                        className="mt-1"
                      />
                      <div className="grid gap-2 leading-none">
                        <Label htmlFor="secure" className="text-base font-medium cursor-pointer">
                          Secure Erase (multi-pass)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Multiple overwrite passes with different patterns. Maximum security against data recovery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleWipeClick}
                  className="w-full bg-gradient-destructive hover:shadow-destructive transition-all duration-300 h-14 text-lg"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Wipe {driveInfo.name}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  You will be asked to confirm this action before proceeding
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Confirm Drive Erasure
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All data on the drive will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-4 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-mono text-base font-medium">{driveInfo.path} – {driveInfo.size} {driveInfo.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{driveInfo.model}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="confirm-text" className="text-base font-medium">Type DELETE to confirm</Label>
                <Input
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="font-mono text-center text-lg h-12"
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Or alternatively</p>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="understand"
                      checked={confirmChecked}
                      onCheckedChange={(checked) => setConfirmChecked(checked === true)}
                    />
                    <Label htmlFor="understand" className="text-sm cursor-pointer">
                      I understand this action cannot be undone
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmWipe}
                className="flex-1 bg-gradient-destructive hover:shadow-destructive h-12 text-base"
                disabled={confirmText.toUpperCase() !== "DELETE" && !confirmChecked}
              >
                <Shield className="w-4 h-4 mr-2" />
                Confirm Wipe Drive
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriveErasure;
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Database, CheckCircle, Clock, Zap, FileX, HardDrive } from "lucide-react";

interface WipeInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WipeInfoDialog = ({ open, onOpenChange }: WipeInfoDialogProps) => {
  const wipeStages = [
    {
      stage: "Pre-Wipe Scan",
      icon: <Database className="w-5 h-5 text-primary" />,
      description: "Analyzing drive structure and identifying all data sectors",
      details: "Maps file system, partitions, and hidden areas",
      duration: "2-5 minutes"
    },
    {
      stage: "Pass 1: Random Pattern",
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      description: "Overwrites all sectors with cryptographically secure random data",
      details: "Destroys original magnetic signatures",
      duration: "15-45 minutes"
    },
    {
      stage: "Pass 2: Complement Pattern", 
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      description: "Writes the inverse (complement) of the previous pattern",
      details: "Ensures complete magnetic domain reversal",
      duration: "15-45 minutes"
    },
    {
      stage: "Pass 3: Verification",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      description: "Reads back all sectors to verify successful overwriting",
      details: "Confirms no data recovery is possible",
      duration: "10-30 minutes"
    },
    {
      stage: "Secure Deletion",
      icon: <FileX className="w-5 h-5 text-red-500" />,
      description: "Removes temporary files and clears system caches",
      details: "Eliminates traces from system memory",
      duration: "1-3 minutes"
    }
  ];

  const securityFeatures = [
    {
      title: "Military-Grade Overwriting",
      description: "Uses DoD 5220.22-M standard patterns to prevent data recovery",
      icon: <Shield className="w-5 h-5 text-primary" />
    },
    {
      title: "Hidden Sector Detection",
      description: "Finds and erases remapped bad sectors and spare areas",
      icon: <HardDrive className="w-5 h-5 text-primary" />
    },
    {
      title: "Cryptographic Randomness",
      description: "Uses hardware random number generators for unpredictable patterns",
      icon: <Zap className="w-5 h-5 text-primary" />
    },
    {
      title: "Real-time Verification",
      description: "Continuously verifies erasure quality during the process",
      icon: <CheckCircle className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            What Happens During Secure Wiping?
          </DialogTitle>
          <DialogDescription>
            Understanding the complete data destruction process
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Warning Section */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive mt-1" />
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Data Destruction Warning</h3>
                  <p className="text-sm text-destructive/80 mb-3">
                    This process will permanently destroy ALL data on your drive. Once started, the data cannot be recovered by any means, including professional data recovery services.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <Badge variant="destructive" className="justify-center">Files & Documents</Badge>
                    <Badge variant="destructive" className="justify-center">Operating System</Badge>
                    <Badge variant="destructive" className="justify-center">Personal Data</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wipe Process Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Secure Wipe Process Stages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wipeStages.map((stage, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {stage.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{stage.stage}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {stage.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stage.description}</p>
                    <p className="text-xs text-muted-foreground">{stage.details}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* What Gets Erased */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileX className="w-5 h-5 text-destructive" />
                What Gets Permanently Erased
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">User Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• All personal files and documents</li>
                    <li>• Photos, videos, and media files</li>
                    <li>• Downloaded software and games</li>
                    <li>• Browser data and saved passwords</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">System Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Operating system files</li>
                    <li>• Application data and settings</li>
                    <li>• System logs and temporary files</li>
                    <li>• Partition tables and boot sectors</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Hidden Areas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Slack space and unallocated sectors</li>
                    <li>• Bad sector remaps and spare areas</li>
                    <li>• Wear leveling reserves (SSDs)</li>
                    <li>• Previously deleted file remnants</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Security Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Encryption keys and certificates</li>
                    <li>• Password hashes and tokens</li>
                    <li>• Digital signatures and licenses</li>
                    <li>• Recovery information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Controls */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                Process Controls Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-background rounded border">
                  <strong className="block mb-1">Pause & Resume</strong>
                  <span className="text-muted-foreground">Safely pause the process anytime</span>
                </div>
                <div className="text-center p-3 bg-background rounded border">
                  <strong className="block mb-1">Progress Tracking</strong>
                  <span className="text-muted-foreground">Real-time sector completion status</span>
                </div>
                <div className="text-center p-3 bg-background rounded border">
                  <strong className="block mb-1">Emergency Stop</strong>
                  <span className="text-muted-foreground">Immediate termination if needed</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-4 p-3 bg-background rounded border">
                <strong>Note:</strong> Pausing will allow you to attempt data recovery of sectors not yet overwritten, but any completed sectors cannot be recovered.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WipeInfoDialog;
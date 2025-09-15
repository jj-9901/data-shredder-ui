import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Cpu, Thermometer, Zap, Clock, Database, Shield, AlertTriangle, FileText } from "lucide-react";

interface DeviceInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowWipeInfo: () => void;
}

const DeviceInfoDialog = ({ open, onOpenChange, onShowWipeInfo }: DeviceInfoDialogProps) => {
  // Mock detailed device information
  const deviceInfo = {
    basic: {
      name: "Samsung SSD 980 PRO",
      path: "/dev/sda",
      size: "500GB",
      type: "NVMe SSD",
      serial: "S6XNMU0R123456",
      firmware: "5B2QGXA7",
      interface: "PCIe 4.0 x4",
    },
    health: {
      temperature: 42,
      powerOnHours: 1247,
      powerCycles: 89,
      totalBytesWritten: "2.7 TB",
      remainingLife: 98,
      badSectors: 0,
      status: "Healthy"
    },
    partitions: [
      { name: "EFI System", size: "100 MB", type: "FAT32", status: "Healthy" },
      { name: "Windows (C:)", size: "465.66 GB", type: "NTFS", status: "Healthy" },
      { name: "Recovery", size: "500 MB", type: "NTFS", status: "Hidden" }
    ],
    security: {
      encryption: "BitLocker Enabled",
      secureErase: "Supported",
      sanitize: "Crypto Erase",
      freezeLock: "Not Frozen"
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Device Information
          </DialogTitle>
          <DialogDescription>
            Detailed information about your storage device
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p className="font-semibold">{deviceInfo.basic.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Device Path</p>
                  <p className="font-mono text-sm">{deviceInfo.basic.path}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                  <p className="font-mono text-sm">{deviceInfo.basic.serial}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                  <p className="font-semibold">{deviceInfo.basic.size} {deviceInfo.basic.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interface</p>
                  <p className="font-semibold">{deviceInfo.basic.interface}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                  <p className="font-mono text-sm">{deviceInfo.basic.firmware}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Thermometer className="w-5 h-5" />
                Health & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Thermometer className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{deviceInfo.health.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <Badge variant="outline" className="mt-1">Normal</Badge>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{deviceInfo.health.powerOnHours}</p>
                  <p className="text-sm text-muted-foreground">Power-On Hours</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{deviceInfo.health.powerCycles}</p>
                  <p className="text-sm text-muted-foreground">Power Cycles</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Drive Life Remaining</p>
                    <p className="text-sm font-bold">{deviceInfo.health.remainingLife}%</p>
                  </div>
                  <Progress value={deviceInfo.health.remainingLife} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Data Written</p>
                    <p className="font-semibold">{deviceInfo.health.totalBytesWritten}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bad Sectors</p>
                    <p className="font-semibold flex items-center gap-1">
                      {deviceInfo.health.badSectors}
                      <Badge variant="outline" className="text-xs">Healthy</Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                Partitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deviceInfo.partitions.map((partition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">{partition.name}</p>
                        <p className="text-sm text-muted-foreground">{partition.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{partition.size}</p>
                      <Badge variant="outline" className="text-xs">{partition.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Encryption Status</p>
                  <p className="font-semibold flex items-center gap-2">
                    {deviceInfo.security.encryption}
                    <Badge>Active</Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Secure Erase</p>
                  <p className="font-semibold flex items-center gap-2">
                    {deviceInfo.security.secureErase}
                    <Badge variant="outline">Available</Badge>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sanitize Command</p>
                  <p className="font-semibold">{deviceInfo.security.sanitize}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security State</p>
                  <p className="font-semibold">{deviceInfo.security.freezeLock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning about wiping */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertTriangle className="w-5 h-5" />
                What Happens During Wiping?
              </CardTitle>
              <CardDescription>
                Understanding the secure erasure process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                During the wiping process, all data on this device will be permanently destroyed using military-grade overwriting patterns.
              </p>
              
              <Button 
                onClick={onShowWipeInfo}
                variant="outline" 
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn What Happens During Wiping
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceInfoDialog;
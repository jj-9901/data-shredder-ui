import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { HardDrive, ChevronRight, ChevronLeft, Settings, Shield, AlertTriangle, Cpu, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ConfigStep = "storage" | "method" | "scope" | "security" | "confirmation";
type StorageType = "hdd" | "ssd" | "nvme" | "emmc";
type EraseMethod = "quick" | "secure" | "military";
type EraseScope = "partition" | "whole" | "free-space";

interface ConfigState {
  storageType: StorageType;
  eraseMethod: EraseMethod;
  eraseScope: EraseScope;
  overwritePasses: number;
  verifyErase: boolean;
  secureDelete: boolean;
}

const Configuration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<ConfigStep>("storage");
  const [config, setConfig] = useState<ConfigState>({
    storageType: "ssd", // Default detected type
    eraseMethod: "secure",
    eraseScope: "whole",
    overwritePasses: 3,
    verifyErase: true,
    secureDelete: true
  });

  // Mock device detection
  useEffect(() => {
    // Simulate device detection
    setTimeout(() => {
      setConfig(prev => ({ ...prev, storageType: "ssd" }));
      toast({
        title: "Device Detected",
        description: "Samsung SSD 980 PRO detected automatically",
      });
    }, 1000);
  }, [toast]);

  const steps: { key: ConfigStep; title: string; description: string }[] = [
    { key: "storage", title: "Storage Type", description: "Select your storage device type" },
    { key: "method", title: "Erase Method", description: "Choose erasure security level" },
    { key: "scope", title: "Erase Scope", description: "What to erase on the drive" },
    { key: "security", title: "Security Options", description: "Advanced security settings" },
    { key: "confirmation", title: "Final Review", description: "Confirm your settings" },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const handleStartWipe = () => {
    navigate("/", { state: { config, startWipe: true } });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "storage":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Cpu className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Storage Device Type</h3>
              <p className="text-muted-foreground">We've detected your device, but you can change it if needed</p>
            </div>
            
            <RadioGroup 
              value={config.storageType} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, storageType: value as StorageType }))}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="ssd" id="ssd" />
                <Label htmlFor="ssd" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">SSD (Solid State Drive)</p>
                      <p className="text-sm text-muted-foreground">Fast, modern storage</p>
                      {config.storageType === "ssd" && <Badge variant="outline" className="mt-1">Detected</Badge>}
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="hdd" id="hdd" />
                <Label htmlFor="hdd" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">HDD (Hard Disk Drive)</p>
                      <p className="text-sm text-muted-foreground">Traditional spinning disk</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="nvme" id="nvme" />
                <Label htmlFor="nvme" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">NVMe SSD</p>
                      <p className="text-sm text-muted-foreground">Ultra-fast PCIe storage</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="emmc" id="emmc" />
                <Label htmlFor="emmc" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">eMMC Storage</p>
                      <p className="text-sm text-muted-foreground">Embedded flash storage</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "method":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Erasure Method</h3>
              <p className="text-muted-foreground">Choose the security level for your data erasure</p>
            </div>
            
            <RadioGroup 
              value={config.eraseMethod} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, eraseMethod: value as EraseMethod }))}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="quick" id="quick" className="mt-1" />
                <Label htmlFor="quick" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Quick Erase (1-pass)</p>
                    <p className="text-sm text-muted-foreground mt-1">Single overwrite pass. Fastest option, suitable for basic security needs.</p>
                    <Badge variant="secondary" className="mt-2">~15 minutes</Badge>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="secure" id="secure" className="mt-1" />
                <Label htmlFor="secure" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Secure Erase (3-pass)</p>
                    <p className="text-sm text-muted-foreground mt-1">Multiple overwrite passes with different patterns. Recommended for most users.</p>
                    <Badge variant="secondary" className="mt-2">~45 minutes</Badge>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="military" id="military" className="mt-1" />
                <Label htmlFor="military" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Military Grade (7-pass)</p>
                    <p className="text-sm text-muted-foreground mt-1">DoD 5220.22-M standard. Maximum security against data recovery.</p>
                    <Badge variant="secondary" className="mt-2">~2 hours</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "scope":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <HardDrive className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Erase Scope</h3>
              <p className="text-muted-foreground">Select what parts of the drive to erase</p>
            </div>
            
            <RadioGroup 
              value={config.eraseScope} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, eraseScope: value as EraseScope }))}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="whole" id="whole" className="mt-1" />
                <Label htmlFor="whole" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Entire Drive</p>
                    <p className="text-sm text-muted-foreground mt-1">Erase all data, partitions, and boot sectors on the drive.</p>
                    <Badge variant="destructive" className="mt-2">Complete Wipe</Badge>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="partition" id="partition" className="mt-1" />
                <Label htmlFor="partition" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Active Partitions Only</p>
                    <p className="text-sm text-muted-foreground mt-1">Erase data in existing partitions, preserving boot sector.</p>
                    <Badge variant="secondary" className="mt-2">Partial Wipe</Badge>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="free-space" id="free-space" className="mt-1" />
                <Label htmlFor="free-space" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Free Space Only</p>
                    <p className="text-sm text-muted-foreground mt-1">Erase unallocated space and deleted file remnants.</p>
                    <Badge variant="outline" className="mt-2">Safe Cleanup</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Security Options</h3>
              <p className="text-muted-foreground">Advanced settings for maximum security</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="verify"
                  checked={config.verifyErase}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, verifyErase: checked === true }))}
                  className="mt-1"
                />
                <Label htmlFor="verify" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Verify Erasure</p>
                    <p className="text-sm text-muted-foreground mt-1">Read back sectors to confirm data has been overwritten.</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="secure-delete"
                  checked={config.secureDelete}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, secureDelete: checked === true }))}
                  className="mt-1"
                />
                <Label htmlFor="secure-delete" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium text-base">Secure File Deletion</p>
                    <p className="text-sm text-muted-foreground mt-1">Use secure deletion for temporary files during process.</p>
                  </div>
                </Label>
              </div>
              
              <div className="p-4 border rounded-lg">
                <Label className="text-base font-medium">Overwrite Passes: {config.overwritePasses}</Label>
                <p className="text-sm text-muted-foreground mb-3">Number of times to overwrite each sector</p>
                <div className="flex gap-2">
                  {[1, 3, 7, 35].map((passes) => (
                    <Button
                      key={passes}
                      variant={config.overwritePasses === passes ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConfig(prev => ({ ...prev, overwritePasses: passes }))}
                    >
                      {passes}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-semibold mb-2 text-destructive">Final Review</h3>
              <p className="text-muted-foreground">Review your settings before proceeding</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Device Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage Type:</span>
                    <span className="font-medium">{config.storageType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Erase Scope:</span>
                    <span className="font-medium capitalize">{config.eraseScope.replace("-", " ")}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium capitalize">{config.eraseMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passes:</span>
                    <span className="font-medium">{config.overwritePasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification:</span>
                    <span className="font-medium">{config.verifyErase ? "Enabled" : "Disabled"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Warning: This Action Cannot Be Undone</p>
                  <p className="text-sm text-destructive/80 mt-1">
                    All data will be permanently destroyed. Make sure you have backed up any important files.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleStartWipe}
              className="w-full bg-gradient-destructive hover:shadow-destructive h-14 text-lg"
            >
              <Shield className="w-5 h-5 mr-3" />
              Start Secure Wipe Process
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
         <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Drive Erasure Configuration</h1>
          <p className="text-muted-foreground">Configure your secure drive erasure settings</p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Configuration Progress</h3>
              <span className="text-sm text-muted-foreground">{currentStepIndex + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{steps[currentStepIndex].title}</span>
              <span>•</span>
              <span>{steps[currentStepIndex].description}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          {currentStep !== "confirmation" && (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuration;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Settings, Zap, Shield, ChevronRight } from "lucide-react";
import DriveErasure from "@/components/DriveErasure";

const Index = () => {
  const navigate = useNavigate();
  const [showQuickWipe, setShowQuickWipe] = useState(false);

  if (showQuickWipe) {
    return <DriveErasure onBackToHome={() => setShowQuickWipe(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-card animate-fade-in">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
            <HardDrive className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl mb-4">Secure Drive Erasure Tool</CardTitle>
          <CardDescription className="text-lg">
            Professional-grade data destruction for secure device disposal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Wipe Option */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => setShowQuickWipe(true)}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Zap className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-xl">Quick Wipe</CardTitle>
                <CardDescription>Start immediately with default settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Auto-detect storage device</li>
                  <li>• 3-pass secure overwrite</li>
                  <li>• Complete drive erasure</li>
                  <li>• Certificate generation</li>
                </ul>
                <Button className="w-full bg-gradient-destructive hover:shadow-destructive group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Quick Wipe
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Advanced Configuration */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => navigate('/configure')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Advanced Configuration</CardTitle>
                <CardDescription>Customize erasure settings step by step</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Choose storage type (HDD/SSD/NVMe)</li>
                  <li>• Select security level (1-35 passes)</li>
                  <li>• Partition vs whole drive options</li>
                  <li>• Verification and advanced security</li>
                </ul>
                <Button variant="outline" className="w-full group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Settings
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Information */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Military-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="font-semibold text-sm">DoD 5220.22-M</div>
                  <div className="text-xs text-muted-foreground">Department of Defense standard for secure data destruction</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Cryptographic Patterns</div>
                  <div className="text-xs text-muted-foreground">Hardware random number generators for unpredictable overwriting</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Verification</div>
                  <div className="text-xs text-muted-foreground">Read-back verification ensures complete data destruction</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <div className="text-center text-xs text-muted-foreground p-4 border rounded-lg bg-muted/20">
            <p className="mb-1"><strong>Legal Notice:</strong> This tool permanently destroys data and cannot be undone.</p>
            <p>Ensure you have proper authorization before using this software on any storage device.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

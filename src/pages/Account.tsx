import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LockKeyhole, Bell, Shield, User as UserIcon, Upload, Eye, EyeOff } from "lucide-react";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { getProfile, updateProfile, changePassword, uploadAvatar } from "@/services/authService";

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Profile settings state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to access your account settings.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Fetch profile from backend
    const fetchProfile = async () => {
      try {
        setIsProfileLoading(true);
        const data = await getProfile();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setCurrency(data.currency || "RWF");
        setAvatarUrl(data.avatar || null);
        
        // Sync local storage
        if (data.avatar) {
          localStorage.setItem("userAvatar", data.avatar);
        } else {
          localStorage.removeItem("userAvatar");
        }
        if (data.name) {
          localStorage.setItem("userName", data.name);
        }
        localStorage.setItem("userCurrency", data.currency || "RWF");
        
        // Trigger navbar updates
        window.dispatchEvent(new CustomEvent('authChange'));
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast({
          title: "Error loading profile",
          description: "Could not retrieve your profile settings from the server.",
          variant: "destructive",
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, [toast, navigate]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updated = await updateProfile({
        name,
        phone,
        currency,
      });
      
      setName(updated.name || "");
      setPhone(updated.phone || "");
      setCurrency(updated.currency || "RWF");
      
      // Update local storage so Navbar changes immediately
      if (updated.name) {
        localStorage.setItem("userName", updated.name);
      }
      localStorage.setItem("userCurrency", updated.currency || "RWF");
      
      window.dispatchEvent(new CustomEvent('authChange'));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast({
        title: "Invalid password",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Confirm password does not match the new password.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast({
        title: "Change password failed",
        description: err instanceof Error ? err.message : "Incorrect old password or invalid data.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2 MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const result = await uploadAvatar(file);
      const secureUrl = result.avatar;

      setAvatarUrl(secureUrl);
      localStorage.setItem("userAvatar", secureUrl);
      
      // Trigger update on Navbar avatar
      window.dispatchEvent(new CustomEvent('authChange'));

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully uploaded to Cloudinary.",
      });
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "An error occurred while uploading avatar image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white text-left">Account Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6 text-left">
            <div className="w-full md:w-1/4">
              <Card className="bg-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 relative group border border-border">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-bet-accent text-bet-primary-foreground text-2xl font-black">
                        {(name || "User").split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer" onClick={() => document.getElementById('avatarUpload')?.click()}>
                        <Upload size={24} className="text-white" />
                      </div>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg text-white">{isProfileLoading ? "Loading..." : name}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">{isProfileLoading ? "Loading..." : email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isUploadingAvatar || isProfileLoading}
                      onClick={() => document.getElementById('avatarUpload')?.click()}
                    >
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                      <input 
                        id="avatarUpload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="profile">
                    <UserIcon size={16} className="mr-2" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <LockKeyhole size={16} className="mr-2" /> Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell size={16} className="mr-2" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy">
                    <Shield size={16} className="mr-2" /> Privacy
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isProfileLoading ? (
                        <div className="py-6 text-center text-muted-foreground">Loading your profile details...</div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-foreground">Email</Label>
                              <Input id="email" value={email} readOnly className="bg-muted/30 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country" className="text-foreground">Country</Label>
                              <Input id="country" defaultValue="Rwanda" readOnly className="bg-muted/30 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="currency" className="text-foreground">Preferred Currency</Label>
                            <select 
                              id="currency" 
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                            >
                              <option value="RWF">Rwandan Franc (RWF)</option>
                              <option value="USD">US Dollar (USD)</option>
                            </select>
                          </div>
                          
                          <Button 
                            onClick={handleSaveProfile} 
                            disabled={isLoading}
                            className="mt-4 bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold"
                          >
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                      <CardDescription>Manage your password and security options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleUpdatePassword} className="max-w-md w-full space-y-4">
                        <h3 className="font-semibold text-lg text-white">Change Password</h3>
                        
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input 
                              id="currentPassword" 
                              type={showCurrentPassword ? "text" : "password"} 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                              disabled={isUpdatingPassword}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              type={showNewPassword ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              disabled={isUpdatingPassword}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              type={showConfirmPassword ? "text" : "password"} 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              disabled={isUpdatingPassword}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                          className="bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold"
                        >
                          {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                        </Button>
                      </form>
                      
                      <div className="pt-6 border-t border-border space-y-4">
                        <h3 className="font-semibold text-lg text-white">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between max-w-md">
                          <div>
                            <p className="font-medium text-white">Enable 2FA</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-white">Notification Preferences</CardTitle>
                      <CardDescription>Control how we contact you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Bet Results</p>
                            <p className="text-sm text-muted-foreground">Get notified when your bets are settled</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Special Offers</p>
                            <p className="text-sm text-muted-foreground">Receive special promotions and bonuses</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Account Activity</p>
                            <p className="text-sm text-muted-foreground">Get important updates about your account</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">AI Predictions</p>
                            <p className="text-sm text-muted-foreground">Receive AI-powered betting tips</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy">
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-white">Privacy Settings</CardTitle>
                      <CardDescription>Manage how your information is used.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Betting History Privacy</p>
                            <p className="text-sm text-muted-foreground">Show my betting activity on leaderboards</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Data Analytics</p>
                            <p className="text-sm text-muted-foreground">Allow us to analyze your betting patterns for better predictions</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Marketing Preferences</p>
                            <p className="text-sm text-muted-foreground">Allow targeted marketing based on your interests</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <Button 
                          variant="outline" 
                          className="text-bet-danger border-bet-danger/30 hover:bg-bet-danger/10 hover:text-bet-danger"
                          onClick={() => setShowDeleteDialog(true)}
                        >
                          Delete My Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Delete Account Dialog */}
      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />
    </div>
  );
};

export default Account;

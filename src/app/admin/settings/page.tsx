'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  getMultiFactorResolver,
  MultiFactorError,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [show2faModal, setShow2faModal] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [multiFactorResolver, setMultiFactorResolver] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      const has2fa = user.multiFactor?.enrolledFactors.length > 0;
      setIs2faEnabled(has2fa);
    }
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const setup2FA = async () => {
    if (!user) return;

    try {
      const resolver = await getMultiFactorResolver(auth, new MultiFactorError('MFA_ENROLLMENT_NEEDED_FOR_2FA', 'enroll'));
      setMultiFactorResolver(resolver);
      
      const session = resolver.session;
      const tfa = PhoneMultiFactorGenerator.factor(session);
      
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      
      const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: session
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
      
      // For TOTP (Authenticator App) - this is a bit more complex and requires more state management
      // This example will focus on phone for simplicity, but a similar pattern applies.
      // A simplified TOTP example:
       const multiFactorSession = await user.multiFactor.getSession();
       const secret = await PhoneMultiFactorGenerator.generateSecret(multiFactorSession);
       const uri = secret.toUri('Eventide Capture', user.email!);
       setQrCodeUri(uri);
       setShow2faModal(true);

    } catch (error) {
        console.error("2FA setup error: ", error);
        toast({
            variant: "destructive",
            title: "2FA Setup Failed",
            description: "Could not start the two-factor authentication setup.",
        });
    }
  };
  
   const finish2faSetup = async () => {
        if (!user || !multiFactorResolver) return;

        try {
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(verificationCode);
            await user.multiFactor.enroll(multiFactorAssertion, 'My Authenticator App');

            setIs2faEnabled(true);
            setShow2faModal(false);
            toast({ title: '2FA Enabled Successfully!' });
        } catch (error) {
            console.error('2FA verification error: ', error);
            toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: 'The verification code is incorrect. Please try again.',
            });
        }
    };


  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <Label>User ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{user.uid}</p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
             <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            <CardDescription>
              {is2faEnabled 
                ? "You have 2FA enabled, which makes your account more secure." 
                : "Add an extra layer of security to your account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
             {is2faEnabled ? (
                <div className="text-sm font-medium text-green-600">
                    Two-Factor Authentication is active.
                </div>
            ) : (
                 <p className="text-sm text-muted-foreground">
                    Use an authenticator app (like Google Authenticator) to get a verification code.
                 </p>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            {!is2faEnabled && (
                <Button onClick={setup2FA}>Enable 2FA</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <div id="recaptcha-container"></div>
      
       <Dialog open={show2faModal} onOpenChange={setShow2faModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                    <DialogDescription>Scan the QR code with your authenticator app, then enter the code below.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                    {qrCodeUri && (
                         <div className="p-4 bg-white rounded-lg border">
                            <QRCodeSVG value={qrCodeUri} size={200} />
                        </div>
                    )}
                    <div className="w-full space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input 
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShow2faModal(false)}>Cancel</Button>
                    <Button onClick={finish2faSetup}>Verify & Enable</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

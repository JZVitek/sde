'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, KeyRound, Copy, Check } from 'lucide-react';
import {
  encryptText,
  decryptText,
  generateDailyPassword,
} from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    const correctPassword = generateDailyPassword();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      toast({
        title: 'Acceso concedido',
        description: 'Bienvenido al sistema de encriptación',
      });
    } else {
      toast({
        title: 'Acceso denegado',
        description: 'Contraseña incorrecta',
        variant: 'destructive',
      });
    }
  };

  const handleEncrypt = () => {
    const encrypted = encryptText(inputText, generateDailyPassword());
    setOutputText(encrypted);
  };

  const handleDecrypt = () => {
    const decrypted = decryptText(inputText, generateDailyPassword());
    if (decrypted) {
      setOutputText(decrypted);
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo desencriptar el texto',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({
      title: 'Copiado',
      description: 'Texto copiado al portapapeles',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = () => {
    setInputText('');
    setOutputText('');
  };

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md backdrop-blur-lg bg-opacity-80 border-primary/20'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
              <KeyRound className='w-6 h-6' />
              Sistema de Encriptación
            </CardTitle>
            <CardDescription className='text-center'>
              Ingresa la contraseña del día para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className='space-y-4'
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <Input
                type='password'
                placeholder='Contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-background/50'
              />
              <Button type='submit' className='w-full'>
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-4 sm:p-8'>
      <Card className='max-w-4xl mx-auto backdrop-blur-lg bg-opacity-80 border-primary/20'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Sistema de Encriptación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue='encrypt'
            className='w-full'
            onValueChange={handleTabChange}
          >
            <TabsList className='grid w-full grid-cols-2 mb-8'>
              <TabsTrigger value='encrypt' className='flex items-center gap-2'>
                <Lock className='w-4 h-4' /> Encriptar
              </TabsTrigger>
              <TabsTrigger value='decrypt' className='flex items-center gap-2'>
                <Unlock className='w-4 h-4' /> Desencriptar
              </TabsTrigger>
            </TabsList>

            <TabsContent value='encrypt'>
              <div className='space-y-4'>
                <Input
                  placeholder='Texto a encriptar'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className='bg-background/50'
                />
                <Button onClick={handleEncrypt} className='w-full'>
                  Encriptar Texto
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='decrypt'>
              <div className='space-y-4'>
                <Input
                  placeholder='Texto encriptado'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className='bg-background/50'
                />
                <Button onClick={handleDecrypt} className='w-full'>
                  Desencriptar Texto
                </Button>
              </div>
            </TabsContent>

            {outputText && (
              <div className='mt-8 space-y-4'>
                <div className='relative'>
                  <Input
                    value={outputText}
                    readOnly
                    className='pr-10 bg-background/50'
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0'
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className='w-4 h-4' />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

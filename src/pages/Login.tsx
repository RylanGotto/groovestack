import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../supabaseClient';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: username,
            },
          },
        });
        if (error) throw error;
        await showToast({ message: 'Registration successful. Check your email.', duration: 3000 });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await showToast({ message: 'Login successful!', duration: 3000 });
      }
    } catch (e: any) {
      await showToast({ message: e.message || 'Something went wrong', duration: 5000 });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isRegistering ? 'Register' : 'Login'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <h1>Supabase + Ionic React</h1>
          <p>{isRegistering ? 'Create an account' : 'Sign in to your account'}</p>
        </div>
        <IonList inset={true}>
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                name="email"
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
                type="email"
              />
            </IonItem>

            {isRegistering && (
              <IonItem>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  value={username}
                  name="username"
                  onIonChange={(e) => setUsername(e.detail.value ?? '')}
                  type="text"
                />
              </IonItem>
            )}

            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                value={password}
                name="password"
                onIonChange={(e) => setPassword(e.detail.value ?? '')}
                type="password"
              />
            </IonItem>

            <div className="ion-text-center ion-padding">
              <IonButton type="submit" expand="block">
                {isRegistering ? 'Register' : 'Login'}
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </IonButton>
            </div>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
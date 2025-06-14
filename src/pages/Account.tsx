import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonLoading,
    useIonToast,
    useIonRouter
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import { supabase } from '../supabaseClient';
  export function AccountPage() {
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();
    const [session, setSession] = useState();
    const router = useIonRouter();
    const [profile, setProfile] = useState({
      username: '',
      website: '',
      avatar_url: '',
    });
    useEffect(() => {
        const init = async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          setSession(session);
          if (session) {
            getProfile(session.user.id); // pass in user ID
          }
        };
        init();
      }, []);
      const getProfile = async (userId: string) => {
        await showLoading();
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`website, avatar_url`)
            .eq('id', userId)
            .single();
      
          if (error && status !== 406) {
            throw error;
          }
      
          if (data) {
            setProfile({
              username: data.user_metadata?.display_name ?? '',
              website: data.website,
              avatar_url: data.avatar_url,
            });
          }
        } catch (error: any) {
          showToast({ message: error.message, duration: 5000 });
        } finally {
          await hideLoading();
        }
      };
    const signOut = async () => {
      await supabase.auth.signOut();
      router.push('/', 'forward', 'replace');
    }
    const updateProfile = async (e?: any, avatar_url: string = '') => {
      e?.preventDefault();
      console.log('update ');
      // await showLoading();
      try {
        const {
            data: { user },
          } = await supabase.auth.getUser();
        const updates = {
          id: user!.id,
          ...profile,
          avatar_url: avatar_url,
          updated_at: new Date(),
        };
        const { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        });
        if (error) {
          throw error;
        }
      } catch (error: any) {
        showToast({ message: error.message, duration: 5000 });
      } finally {
        await hideLoading();
      }
    };
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={updateProfile}>
            <IonItem>
              <IonLabel>
                <p>Email</p>
                <p>{session?.user?.email}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                type="text"
                name="username"
                value={session?.user?.user_metadata.display_name}
                onIonChange={(e) =>
                  setProfile({ ...profile, username: e.detail.value ?? '' })
                }
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Website</IonLabel>
              <IonInput
                type="url"
                name="website"
                value={profile.website}
                onIonChange={(e) =>
                  setProfile({ ...profile, website: e.detail.value ?? '' })
                }
              ></IonInput>
            </IonItem>
            <div className="ion-text-center">
              <IonButton fill="clear" type="submit">
                Update Profile
              </IonButton>
            </div>
          </form>
          <div className="ion-text-center">
            <IonButton fill="clear" onClick={signOut}>
              Log Out
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
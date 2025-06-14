import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import { supabase } from './supabaseClient'
import { LoginPage } from './pages/Login'
import { AccountPage } from './pages/Account'
import { useEffect, useState } from 'react'
// import { Session } from '@supabase/supabase-js'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// const App: React.FC = () => {
//   const [session, setSession] = useState<Session | null>(null);
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });
//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])
//   return (
//     <IonApp>
//       <IonReactRouter>
//         <IonRouterOutlet>
//           <Route
//             exact
//             path="/"
//             render={() => {
//               return session ? <Redirect to="/account" /> : <LoginPage />
//             }}
//           />
//           <Route exact path="/account">
//             <AccountPage />
//           </Route>
//         </IonRouterOutlet>
//       </IonReactRouter>
//     </IonApp>
//   )
// }
// export default App

// import { useEffect, useState } from 'react';
// import { IonApp, IonSplitPane, IonRouterOutlet } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
// import { Redirect, Route } from 'react-router-dom';
// import { Session } from '@supabase/supabase-js';
// import { supabase } from './supabaseClient';

// import Menu from './components/Menu';
// import Page from './pages/Page';
// import AccountPage from './pages/AccountPage';
// import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Optional: add a loading screen if session is still loading
  if (session === undefined) {
    return <div>Loading...</div>; // replace with a spinner if you want
  }

  return (
    <IonApp>
      <IonReactRouter>
        {session ? (
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route exact path="/" render={() => <Redirect to="/account" />} />
              <Route exact path="/account" component={AccountPage} />
              <Route exact path="/folder/:name" component={Page} />
              <Route render={() => <Redirect to="/account" />} />
            </IonRouterOutlet>
          </IonSplitPane>
        ) : (
          <IonRouterOutlet>
            <Route exact path="/" component={LoginPage} />
            <Route render={() => <Redirect to="/" />} />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
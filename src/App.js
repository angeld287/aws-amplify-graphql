import React, { Component } from 'react';
//import logo from './logo.png';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

//AppSync and Apollo libraries
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//Amplify
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

// Components
import AllPhotos from "./Components/AllPhotos";
import AddPhoto from "./Components/AddPhoto";
import Navigation from "./Components/Navigation";

import awsconfig from './aws-exports';

// Amplify init
Amplify.configure(awsconfig);

const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
const AUTH_TYPE = awsconfig.aws_appsync_authenticationType

// AppSync client instantiation
const client = new AWSAppSyncClient({
  url: GRAPHQL_API_ENDPOINT_URL,
  region: GRAPHQL_API_REGION,
  auth: {
    type: AUTH_TYPE,
    // Get the currently logged in users credential.
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  },
  // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
  complexObjectsCredentials: () => Auth.currentCredentials()
});

class App extends Component {
  state = {
    username: '',
    user_roll: ''
  }
  
  componentDidMount() {
    Auth.currentUserInfo()
      .then(data => {
        this.setState({
          username: data.username
        })
      })
      .catch(err => console.log('error: ', err))
    
    let result = async () => await Auth.userAttributes(await Auth.currentAuthenticatedUser());
    result().then(
      data => {
        data.forEach(element => {
          if (element.Name === 'custom:user_roll') {
            this.setState({
              user_roll: element.Value
            })
          }
        });
      });
  }

  render() {
    const esEmpresa = this.state.user_roll === 'empresa';
    return (
      <BrowserRouter>
        <div className="App">
          <Navigation />
          <Switch>
            <Route path="/AddPhoto" component={AddPhoto} />
            <Route path="/AllPhotos" component={AllPhotos} />
          </Switch>
        </div>
      </BrowserRouter>
      
    );
  }
}

const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
);

/* 
  1. es necesario poder customizar la UI del login, signup y de la barra del menu.
  2. se tiene que customizar el signup para que complete el campo "user_roll"

  {esEmpresa && (<AddPhoto/>)}
*/
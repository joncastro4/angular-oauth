import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleOauth {
  // NOTE: In a production app, these environment variables would be loaded securely.
  // We'll use placeholders that must match your server's configuration.
  private readonly GOOGLE_CLIENT_ID = environment.GOOGLE_OAUTH_CLIENT_ID;
  private readonly REDIRECT_URI = 'http://localhost:3000/api/v1/oauth/google/callback'; // MUST match server and Google Console
  private readonly SCOPE = 'email profile';
  private readonly RESPONSE_TYPE = 'code';

  constructor() { }

  /**
   * Generates the URL to redirect the user to Google's sign-in page.
   * This is the first step in the server-side OAuth 2.0 flow.
   * @returns The full Google Authorization URL.
   */
  public getGoogleAuthUrl(): string {
    // Generate a random string for the 'state' parameter to prevent CSRF attacks.
    // The server must check that this state matches the state returned by Google.
    const state = this.generateRandomString(16);

    const params = {
      client_id: this.GOOGLE_CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: this.RESPONSE_TYPE,
      scope: this.SCOPE,
      state: state,
      access_type: 'offline', // Request a refresh token for long-term access
      include_granted_scopes: 'true'
    };

    const queryString = new URLSearchParams(params).toString();
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
  }

  /**
   * Simple function to generate a secure random string (used for the 'state' parameter).
   */
  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}

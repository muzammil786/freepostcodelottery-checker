freepostcodelottery-checker
===========================
version 0.0.1

Muzammil Shahbaz

muzammil.shahbaz@gmail.com

## Summary
This app checks for your UK postcode at daily free postcode lottery at https://freepostcodelottery.com.

It is painful to check the webpage everyday just to find out you are not the lucky one today. 
This small app does this job for you. Just set your postcode (and email settings) and leave this app running. 
It will visit the webpage everyday for you and send you email if your postcode has won the lottery.

## Prerequisites
 - Node.js installed.
 - The npm package management tool (comes with Node.js)
 - GMail account

In addition, the app uses an image recognition dependency called *dv*, which requires  

On Unix:
- Python (v2.7 recommended, v3.x.x is not supported)
- make
- A proper C/C++ compiler toolchain, like GCC

On Mac OS X:
- Python (v2.7 recommended, v3.x.x is not supported) (already installed on Mac OS X)
- Xcode
- You also need to install the Command Line Tools via Xcode. You can find this under the menu Xcode -> Preferences -> Downloads
- This step will install gcc and the related toolchain containing make

On Windows:
- No manual installation required. It requires Microsoft's windows-build-tools, which is already installed through package.json.
- Run with antivirus disabled (if you use Windows Defender, turn off Real-Time protection and Cloud-based protection).

## Setup Free Postcode Lottery settings
 1. Sign up at [Free Postcode Lottery](https://freepostcodelottery.com) page.     
 2. You will start receiving daily alerts via email in HTML format.
 3. Open your email and find the text "Quick Links" at the bottom of the email. You will find the links for all the draws next to it: Main Draw, Survey Draw, Bonus Draw, Video Draw and Stackport.
 4. Right click on any of these links and copy the link address. An example of the link address from *Main Draw* will look like this:
 http://mailer.freepostcodelottery.com/click.php/e987655/o144321/sf08123408i/?utm_source=Jackpot%20Button&utm_medium=Email&utm_campaign=Email%20Jackpot&utm_content=Monday%20Draw%20Alert&reminder=dfca8814-6310-11dr-affp-99163zz58771
 
 5. Paste the link address in a notepad. 
 6. At the end of the link, you will find the parameter **"reminder"**. Extract the value of this parameter. In the example above, the reminder is **dfca8814-6310-11dr-affp-99163zz58771**.
 7. In `config/fpl_settings.json`, find the key *fpl_user_id* and save the value of the reminder.
 8. In `config/fpl_settings.json`, find the key *postcode* and save your postcode.

## Enable Gmail API
The app uses OAuth 2.0 authorization framework to access your Gmail account to be able to send email when your postcode appears on the draw. You have to activate Gmail API from [Google Developers Console](https://console.developers.google.com). The step by step process is explained by Google as follows: 

### Get a client ID and client secret
 1. Open the [Google Developers Console](https://console.developers.google.com) page.     
 2. From the project drop-down, choose 'Create a new project', enter a name for the project, e.g., 'FPL Daily Checker'. 
 3. On the Credentials page, select Create credentials, then select OAuth client ID. 
 4. Under Application type, choose Web application. 
 5. Under Authorized redirect URIs, add https://developers.google.com/oauthplayground
 6. Click Create. 
 7. On the page that appears, take note of the **Client ID**
    and **Client Secret**. Save them into `config/client_secret.json` for keys
    *client_id* and *client_secret* respectively.
  
### Generate tokens
1. Go to the [OAuth2 Playground](https://developers.google.com/oauthplayground).
2. Click the gear icon in the upper right corner and check the box labeled 'Use your own OAuth credentials' (if it isn't already checked). Make sure that:
    1. OAuth flow is set to Server-side.
    2. Access type is set to Offline (this ensures you get a refresh token and an access token, instead of just an access token).
3. Enter the OAuth2 client ID and OAuth2 client secret you obtained above.
4. In the section labeled 'Step 1 - Select & authorize APIs', select https://mail.google.com/ under Gmail API v1
5. Click Authorize APIs
6. If prompted, log in to the account to which you want to grant access and authorization. Otherwise, allow the app to access Gmail and Calendar.
7. In the tab labeled 'Step 2 - Exchange authorization code for tokens', you should now see an Authorization code. Click 'Exchange authorization code' for tokens.
8. If all goes well, you should see the Refresh token and Access token filled in for you (you may have to re-expand 'Step 2 - Exchange authorization code' for tokens to see these values)
9. Copy the **Refresh token** and save into `config/client_secret.json` for the key *refresh_token*. 

### Setup Email message
1. Open `config/email_message_settings.json` and customize message to suit your taste.
2. Open `config/client_secret.json` and edit the user key to your Google user account.

### Run the program

1. Install the dependencies by executing the command: `npm install`.
2. After the dependencies are installed successfully, run the app with the command `npm start`.  

This app will visit the webpage, and send you email if your postcode in among the winning ones. It will sleep for 24 hours before the next check.


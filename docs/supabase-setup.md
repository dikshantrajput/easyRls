### Steps:

- Create a project in (supabase)[database.new]
- Go to Table Editor and create a new schema named `base`

- Go to project settings
<!-- - Go to database settings -->
<!-- - Go to network restrictions -> restrict all access (This will restrict all access to database externally) -->

- Go to API section 
- Copy url and paste it in `.env` file `PUBLIC_SUPABASE_URL` variable
- Copy anon/ public key and paste it in `.env` file `PUBLIC_SUPABASE_ANON_KEY` variable
- Copy service key and paste it in `.env` file `PUBLIC_SUPABASE_SERVICE_KEY` variable
- Scroll down and find the Data API settings
- Add `base` to exposed schema list and extra search path
- Save the settings

- Go to Authentication
- Turn on the SMTP Settings
- Create an account on (resend)[https://resend.com/]
- Go to Settings -> SMTP
- Copy the settings and paste it in supabase 
- If you do not want to use resend, paste your custom SMTP settings



`npx supabase login`

if it prompts to install package, press yes

`npx supabase init`
Enter y if prompted for vscode settings

`npx supabase start`

`npx supabase link`

To fetch everything from supabase db
`npx supabase db pull`

To fetch auth and storage database schema
`npx supabase db pull --schema auth, storage`

TO push to remote db
`npx supabase db push`
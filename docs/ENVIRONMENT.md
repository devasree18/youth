# YOUTH Platform — Environment Variables Reference

| Variable Name | Required | Server/Client | Default Value | Description |
| --- | --- | --- | --- | --- |
| `PORT` | Optional | Server | `5000` | Port for local Express server |
| `NODE_ENV` | Required | Server | `development` | Environment mode (`development` / `production` / `test`) |
| `MONGODB_URI` | Required | Server | None | MongoDB Atlas connection string |
| `JWT_SECRET` | **Mandatory in Prod** | Server | None | Secret key for JWT signing & verification |
| `COOKIE_SECRET` | Optional | Server | None | Secret key for signed cookies |
| `ALLOWED_ORIGINS` | Required in Prod | Server | `http://localhost:5173` | Comma-separated list of permitted CORS origins |
| `GEMINI_API_KEY` | Optional | Server | None | Google Gemini AI API key |
| `OPENAI_API_KEY` | Optional | Server | None | OpenAI API key |
| `RAZORPAY_KEY_ID` | Optional | Server | None | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Optional | Server | None | Razorpay key secret |
| `VITE_API_URL` | Optional | Client | `/api/v1` | Frontend API base URL |

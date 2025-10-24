# Play Store Version Check API

[![GitHub](https://img.shields.io/github/license/dearsikandarkhan/playstore-version-check)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A lightweight REST API service to programmatically check the current version of any Android application published on Google Play Store.

## 🚀 Overview

Play Store Version Check is a simple yet powerful Node.js API that allows developers to retrieve the current version of any Android application directly from the Google Play Store. No authentication required, no complex setup—just pass the package name and get the version instantly.

## ✨ Features

- **Simple REST API**: Easy-to-use endpoint with package name parameter
- **Real-time Version Info**: Fetches current app version from Google Play Store
- **No Authentication**: No API keys or OAuth tokens required
- **Lightweight**: Minimal dependencies and fast response times
- **Cross-platform**: Works with any HTTP client or programming language
- **Perfect for**: Version checking, update notifications, CI/CD pipelines, app monitoring

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Usage](#api-usage)
- [Use Cases](#use-cases)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🔧 Installation

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/dearsikandarkhan/playstore-version-check.git
cd playstore-version-check
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the server:
```bash
npm start
# or
node index.js
```

The API will be available at `http://localhost:3000` by default.

## 🎯 Quick Start

Once the server is running, you can check any app's version by making a GET request:

```bash
curl http://localhost:3000/com.example.app
```

Replace `com.example.app` with any valid Android package name from Google Play Store.

## 📖 API Usage

### Endpoint

```
GET /{packageName}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| packageName | string | Yes | The Android application package name (e.g., com.whatsapp) |

### Example Request

```bash
# Check WhatsApp version
curl http://localhost:3000/com.whatsapp

# Check Instagram version
curl http://localhost:3000/com.instagram.android

# Check your app version
curl http://localhost:3000/com.egnify.getranks
```

### Example Response

```json
{
  "packageName": "com.whatsapp",
  "version": "2.23.20.10",
  "versionCode": "232010000",
  "lastUpdated": "October 2023"
}
```

### Integration Examples

#### JavaScript (Fetch API)
```javascript
fetch('http://localhost:3000/com.example.app')
  .then(response => response.json())
  .then(data => {
    console.log('Current version:', data.version);
  });
```

#### Python
```python
import requests

response = requests.get('http://localhost:3000/com.example.app')
data = response.json()
print(f"Current version: {data['version']}")
```

#### cURL
```bash
curl -X GET http://localhost:3000/com.example.app
```

#### Android (Kotlin)
```kotlin
val url = "http://localhost:3000/com.example.app"
val client = OkHttpClient()
val request = Request.Builder().url(url).build()

client.newCall(request).enqueue(object : Callback {
    override fun onResponse(call: Call, response: Response) {
        val version = JSONObject(response.body?.string()).getString("version")
        println("Current version: $version")
    }
})
```

## 💡 Use Cases

### 1. Force Update Feature
Implement mandatory app updates by comparing installed version with Play Store version:

```javascript
const installedVersion = "1.0.0";
const storeVersion = await fetch('http://localhost:3000/com.yourapp').then(r => r.json());

if (storeVersion.version > installedVersion) {
  showUpdateDialog();
}
```

### 2. CI/CD Pipeline Integration
Automate version checking in your deployment workflow:

```yaml
# GitHub Actions example
- name: Check Play Store Version
  run: |
    VERSION=$(curl http://your-api.com/com.yourapp | jq -r '.version')
    echo "Current Play Store version: $VERSION"
```

### 3. App Monitoring Dashboard
Build a monitoring system to track app versions across multiple applications:

```javascript
const apps = ['com.app1', 'com.app2', 'com.app3'];
const versions = await Promise.all(
  apps.map(pkg => fetch(`http://localhost:3000/${pkg}`).then(r => r.json()))
);
```

### 4. Update Notification System
Send automated notifications when new versions are available:

```javascript
setInterval(async () => {
  const currentVersion = await checkPlayStoreVersion();
  if (currentVersion !== lastCheckedVersion) {
    sendNotificationToUsers();
  }
}, 3600000); // Check every hour
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
CACHE_DURATION=3600
```

### Port Configuration

Change the default port by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Deployment

#### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

#### Deploy to AWS Lambda
Use the Serverless Framework or AWS SAM for serverless deployment.

#### Deploy with Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

Build and run:
```bash
docker build -t playstore-version-check .
docker run -p 3000:3000 playstore-version-check
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Web Scraping**: Cheerio / Puppeteer (for parsing Play Store HTML)
- **HTTP Server**: Express.js
- **Caching**: In-memory or Redis (optional)

## 📊 Performance

- **Response Time**: < 500ms (with caching)
- **Rate Limiting**: Configurable per IP
- **Caching**: Reduces Play Store requests and improves speed

## 🔒 Security Best Practices

- Implement rate limiting to prevent abuse
- Use HTTPS in production environments
- Add input validation for package names
- Consider adding authentication for private deployments
- Monitor and log suspicious activities

## 🐛 Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Version information returned |
| 400 | Bad Request - Invalid package name |
| 404 | Not Found - App not found on Play Store |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server issue |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

## 📧 Contact

**Sikandar Khan** - [@dearsikandarkhan](https://github.com/dearsikandarkhan)

Project Link: [https://github.com/dearsikandarkhan/playstore-version-check](https://github.com/dearsikandarkhan/playstore-version-check)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by the need for simple version checking solutions
- Built with ❤️ for the developer community

## 📚 Related Projects

- [Android Version Checker](https://github.com/levabd/android-version-checker) - Python-based version checker
- [GPVersionChecker](https://github.com/robohorse/GPVersionChecker) - Android library for version checking
- [AppUpdater](https://github.com/javiersantos/AppUpdater) - Android library with update dialogs

## 🗺️ Roadmap

- [ ] Add batch version checking endpoint
- [ ] Implement Redis caching
- [ ] Add GraphQL API support
- [ ] Create official Docker image
- [ ] Add detailed analytics and logging
- [ ] Support for iOS App Store version checking
- [ ] WebSocket support for real-time updates
- [ ] Admin dashboard for monitoring

## ❓ FAQ

**Q: Do I need a Google Play Developer account?**  
A: No, this API works without any authentication.

**Q: Is there a rate limit?**  
A: Configurable based on your deployment. Default settings apply reasonable limits.

**Q: Can I use this in production?**  
A: Yes, but ensure proper caching and rate limiting are configured.

**Q: Does this work with unreleased apps?**  
A: No, the app must be published on Google Play Store.

**Q: How often is the version information updated?**  
A: It reflects the latest version available on Play Store at the time of request.

---

<p align="center">Made with ❤️ by <a href="https://github.com/dearsikandarkhan">Sikandar Khan</a></p>

<p align="center">
  <a href="https://github.com/dearsikandarkhan/playstore-version-check/issues">Report Bug</a> •
  <a href="https://github.com/dearsikandarkhan/playstore-version-check/issues">Request Feature</a> •
  <a href="https://github.com/dearsikandarkhan/playstore-version-check/pulls">Send a Pull Request</a>
</p>
